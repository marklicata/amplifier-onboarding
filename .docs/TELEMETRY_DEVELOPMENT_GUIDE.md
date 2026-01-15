# Telemetry Development Guide

A guide for developers working with telemetry in the Amplifier Onboarding application.

## Quick Start: Debug Mode

By default, telemetry events are accumulated silently (no console output). To enable console logging for development:

### Enable Debug Mode

Open your browser console and run:

```javascript
window.telemetryDevTools.setDebug(true)
```

You'll now see all telemetry events logged to the console with color-coded formatting:

```
[Telemetry Event] click { element_type: "button", track_label: "Header - Home Link", ... }
[Telemetry Event] playground_bundle_selected { bundle_id: "00-basic-bundle", ... }
```

### Disable Debug Mode

```javascript
window.telemetryDevTools.setDebug(false)
```

**Note**: Debug mode persists for the session (until you close the browser tab).

## Development Tools

The `window.telemetryDevTools` object provides several utilities:

### Check Debug Status

```javascript
window.telemetryDevTools.isDebugEnabled()
// Returns: true or false
```

### View Accumulated Events

```javascript
window.telemetryDevTools.getLogs()
// Returns: Array of all captured events
```

### Export to JSONL File

```javascript
window.telemetryDevTools.export()
// Downloads: telemetry-events-[timestamp].jsonl
```

This is useful for:
- Immediate testing feedback (no waiting for Azure ingestion delay)
- Analyzing event patterns locally
- Debugging event payloads
- Sharing event logs with the team

### View Statistics

```javascript
window.telemetryDevTools.getStats()
// Returns: { totalEvents: 150, eventTypes: { click: 45, page_view_auto: 5, ... } }
```

### Clear Accumulated Events

```javascript
window.telemetryDevTools.clear()
// Clears all events from sessionStorage
```

## Event Types

The telemetry system captures several types of events:

### Custom Events
- `click` - User clicks on interactive elements
- `chat_opened`, `chat_closed` - Chat window interactions
- `message_sent`, `response_received` - Chat messages
- `playground_bundle_selected`, `playground_bundle_execution_start`, `playground_bundle_execution_complete` - Bundle operations
- `playground_recipe_selected`, `playground_recipe_execution_start`, `playground_recipe_step_complete`, `playground_recipe_execution_complete` - Recipe operations
- `playground_prompt_suggestion_clicked`, `playground_yaml_toggled`, `playground_parameter_modified` - UI interactions
- `header_dropdown_opened`, `header_dropdown_closed` - Navigation events

### Automatic Events
- `page_view_auto` - Automatic pageviews from route changes
- `exception_auto` - Unhandled JavaScript errors
- `metric_auto` - Performance metrics

## JSONL File Format

Exported events use newline-delimited JSON format (JSONL):

```json
{"timestamp":"2026-01-15T18:00:00.000Z","event":"click","properties":{"element_type":"button","track_label":"Execute Bundle"}}
{"timestamp":"2026-01-15T18:00:01.234Z","event":"playground_bundle_execution_start","properties":{"bundle_id":"00-basic-bundle","bundle_name":"Basic Bundle"}}
```

Each line is a complete JSON object representing one event.

### Analyzing JSONL Files

Using `jq` (command-line JSON processor):

```bash
# Count events by type
cat telemetry-events-*.jsonl | jq -r '.event' | sort | uniq -c | sort -rn

# Filter to only click events
cat telemetry-events-*.jsonl | jq 'select(.event == "click")'

# Extract all bundle executions
cat telemetry-events-*.jsonl | jq 'select(.event | startswith("playground_bundle"))'

# Calculate average execution time
cat telemetry-events-*.jsonl | jq 'select(.event == "playground_bundle_execution_complete") | .properties.duration_ms' | jq -s 'add/length'
```

## Testing Telemetry

### Manual Testing Workflow

1. **Start the app**: `npm run dev`
2. **Enable debug mode**: `window.telemetryDevTools.setDebug(true)`
3. **Interact with the app**: Click buttons, execute bundles, etc.
4. **Watch console**: See events logged in real-time
5. **Export events**: `window.telemetryDevTools.export()`
6. **Analyze**: Review the JSONL file

### Automated Testing

For automated tests, you can programmatically access events:

```javascript
import { getDevLogs } from '@/lib/telemetry';

// In your test
const events = getDevLogs();
const clickEvents = events.filter(e => e.event === 'click');
expect(clickEvents.length).toBeGreaterThan(0);
```

## Adding Custom Tracking

### Using Data Attributes

The easiest way to track interactions:

```tsx
<button data-track-label="My Custom Button">
  Click Me
</button>
```

This will automatically be tracked with the label when clicked.

### Using Track Context

Group related elements:

```tsx
<div data-track-context="my-feature">
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```

All clicks inside will have `track_context: "my-feature"`.

### Manual Event Tracking

For custom events:

```typescript
import { trackEvent } from '@/lib/telemetry';

trackEvent('my_custom_event', {
  custom_property: 'value',
  another_property: 123
});
```

### Playground-Specific Tracking

Use the playground hook:

```typescript
import { usePlaygroundTracking } from '@/lib/telemetry';

const Component = () => {
  const tracking = usePlaygroundTracking({
    itemId: 'my-bundle',
    itemName: 'My Bundle',
    itemType: 'bundle'
  });

  const handleExecute = async () => {
    const startTime = tracking.trackBundleExecutionStart('my-bundle', 'My Bundle');
    try {
      // ... execution logic ...
      tracking.trackBundleExecutionComplete('my-bundle', 'My Bundle', startTime, true);
    } catch (error) {
      tracking.trackBundleExecutionComplete('my-bundle', 'My Bundle', startTime, false, error.message);
    }
  };
};
```

## Opt-Out Patterns

### Prevent Tracking on Specific Elements

```tsx
<div data-track="false">
  <button>This won't be tracked</button>
  <a href="/secret">This won't be tracked</a>
</div>
```

### Sensitive Areas

Mark entire sections as sensitive:

```tsx
<form data-track-context="sensitive">
  {/* No clicks inside will be tracked */}
</form>
```

## Troubleshooting

### Events Not Appearing

1. **Check if debug mode is enabled**: `window.telemetryDevTools.isDebugEnabled()`
2. **Check sessionStorage**: Open DevTools → Application → Session Storage → look for `amplifier_telemetry_dev_log`
3. **Check for console errors**: Look for `[DevLogger]` errors

### Duplicate Events

If you see duplicate events:
- Check that you're not calling tracking functions multiple times
- Verify component isn't rendering twice (React StrictMode can cause this in development)

### Missing Properties

If event properties are missing:
- Check that the element has the expected data attributes
- Use `window.telemetryDevTools.getLogs()` to inspect the actual event payload
- Enable debug mode to see events as they're captured

## Best Practices

### DO:
- ✅ Use `data-track-label` for important interactions
- ✅ Use `data-track-context` to group related elements
- ✅ Test with debug mode enabled during development
- ✅ Export and review events before deploying changes
- ✅ Use semantic labels ("Execute Bundle", not "btn_1")

### DON'T:
- ❌ Track form input values (privacy)
- ❌ Track passwords or sensitive data
- ❌ Leave debug mode enabled in production
- ❌ Use generic labels ("Click", "Button")
- ❌ Track non-interactive elements

## Production Deployment

When deploying to production:

1. **Ensure debug mode is off** (default behavior)
2. **Add Application Insights connection string** to environment variables
3. **Verify events appear in Azure Portal** (2-5 minute delay)
4. **Monitor error rates** in Application Insights dashboards

Debug mode only exists in development (`NODE_ENV === 'development'`), so it's automatically disabled in production builds.

---

For implementation details and complete event catalog, see [TELEMETRY_IMPLEMENTATION_SUMMARY.md](./TELEMETRY_IMPLEMENTATION_SUMMARY.md).
