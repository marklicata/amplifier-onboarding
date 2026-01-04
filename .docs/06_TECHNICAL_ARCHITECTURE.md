# Technical Architecture

## System Overview

The web experience consists of three main components:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Static)                    │
│                                                         │
│  Next.js + React                                        │
│  ├─ Homepage & Marketing                                │
│  ├─ Recipe Gallery                                      │
│  ├─ Visual Builders                                     │
│  ├─ Documentation                                       │
│  └─ Community Platform                                  │
│                                                         │
│  Hosted on: GitHub Pages / Vercel                       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS / WebSocket
┌──────────────────┴──────────────────────────────────────┐
│                    Backend API                          │
│                                                         │
│  Python FastAPI                                         │
│  ├─ Recipe Execution Engine                             │
│  ├─ Sandbox Management                                  │
│  ├─ User Sessions                                       │
│  ├─ Gallery Management                                  │
│  └─ Authentication                                      │
│                                                         │
│  Hosted on: Fly.io / Cloud Run                          │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────┐
│              Amplifier Core (Sandboxed)                 │
│                                                         │
│  Execution Environment                                  │
│  ├─ Bundle Resolver                                     │
│  ├─ Recipe Executor                                     │
│  ├─ Agent Orchestration                                 │
│  └─ Tool Sandboxing                                     │
│                                                         │
│  Security: Isolated containers with resource limits     │
└─────────────────────────────────────────────────────────┘

         Supporting Services
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL       │  Redis          │  S3-compatible    │
│  User data        │  Job queue      │  File storage     │
│  Gallery content  │  Rate limiting  │  Execution logs   │
│  Sessions         │  Caching        │  User uploads     │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

**Core:**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3
- **Components:** Shadcn/ui
- **State:** Zustand (lightweight alternative to Redux)
- **Data Fetching:** TanStack Query (React Query)

**Specialized Libraries:**
- **Code Editor:** Monaco Editor (VS Code editor)
- **Diagrams:** React Flow (node-based diagrams)
- **Animation:** Framer Motion
- **Markdown:** React Markdown + Remark/Rehype
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts

**Developer Experience:**
- **Language:** TypeScript
- **Linting:** ESLint + Prettier
- **Testing:** Vitest + React Testing Library + Playwright
- **Build:** Turbo (Turborepo)

### Directory Structure

```
frontend/
├── app/                        # Next.js 14 app directory
│   ├── (marketing)/           # Marketing pages group
│   │   ├── page.tsx           # Homepage
│   │   ├── about/
│   │   └── pricing/
│   ├── playground/            # Recipe playground
│   │   ├── page.tsx
│   │   └── [recipeId]/
│   ├── learn/                 # Learning hub
│   │   ├── tutorials/
│   │   └── concepts/
│   ├── builder/               # Builder studio
│   │   ├── recipe/
│   │   ├── agent/
│   │   ├── bundle/
│   │   └── module/
│   ├── gallery/               # Community gallery
│   │   ├── recipes/
│   │   ├── bundles/
│   │   └── modules/
│   ├── docs/                  # Documentation
│   │   └── [...slug]/
│   └── api/                   # API routes (if needed)
│
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── recipe/                # Recipe-specific components
│   │   ├── RecipeEditor.tsx
│   │   ├── ExecutionView.tsx
│   │   └── ContextFlowViz.tsx
│   ├── builder/               # Builder components
│   │   ├── NodeCanvas.tsx
│   │   ├── PropertyPanel.tsx
│   │   └── YAMLPreview.tsx
│   └── shared/                # Shared components
│
├── lib/
│   ├── api/                   # API client
│   │   ├── recipes.ts
│   │   ├── gallery.ts
│   │   └── execution.ts
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── validation/            # Zod schemas
│   └── constants/
│
├── public/
│   ├── recipes/               # Example recipes
│   ├── docs/                  # Markdown docs
│   └── assets/
│
└── styles/
    └── globals.css
```

### Key Features Implementation

#### 1. Recipe Playground

**Components:**
```typescript
// components/recipe/RecipePlayground.tsx
export function RecipePlayground() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [execution, setExecution] = useState<Execution | null>(null);
  
  return (
    <div className="grid grid-cols-12 gap-4 h-screen">
      {/* Left: Gallery */}
      <div className="col-span-3">
        <RecipeGallery onSelect={setSelectedRecipe} />
      </div>
      
      {/* Center: Editor */}
      <div className="col-span-6">
        <RecipeEditor 
          recipe={selectedRecipe}
          onExecute={(recipe) => executeRecipe(recipe)}
        />
      </div>
      
      {/* Right: Execution */}
      <div className="col-span-3">
        <ExecutionView execution={execution} />
      </div>
    </div>
  );
}
```

**Real-time Execution:**
```typescript
// lib/api/execution.ts
export function useRecipeExecution() {
  const [execution, setExecution] = useState<Execution | null>(null);
  
  useEffect(() => {
    if (!execution?.id) return;
    
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`${WS_URL}/executions/${execution.id}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setExecution(prev => ({
        ...prev,
        ...update
      }));
    };
    
    return () => ws.close();
  }, [execution?.id]);
  
  return { execution, setExecution };
}
```

#### 2. Visual Recipe Builder

**Node-based Editor:**
```typescript
// components/builder/RecipeBuilder.tsx
import ReactFlow, { 
  Node, 
  Edge, 
  Controls,
  Background 
} from 'reactflow';

export function RecipeBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);
  
  // Convert nodes/edges to YAML
  const toYAML = useCallback(() => {
    return nodesToRecipeYAML(nodes, edges);
  }, [nodes, edges]);
  
  return (
    <div className="h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={customNodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
      
      <YAMLPreview yaml={toYAML()} />
    </div>
  );
}
```

#### 3. Monaco Editor Integration

**YAML Editor with Intelligence:**
```typescript
// components/editor/YAMLEditor.tsx
import Editor from '@monaco-editor/react';

export function YAMLEditor({ value, onChange }: Props) {
  const handleEditorDidMount = (editor, monaco) => {
    // Custom YAML validation
    monaco.languages.registerDocumentFormattingEditProvider('yaml', {
      provideDocumentFormattingEdits(model) {
        return [{
          range: model.getFullModelRange(),
          text: formatYAML(model.getValue())
        }];
      }
    });
    
    // Auto-completion
    monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems(model, position) {
        return {
          suggestions: getYAMLCompletions(model, position)
        };
      }
    });
  };
  
  return (
    <Editor
      height="100%"
      language="yaml"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  );
}
```

### Performance Optimization

**Code Splitting:**
```typescript
// app/builder/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const RecipeBuilder = dynamic(
  () => import('@/components/builder/RecipeBuilder'),
  { ssr: false, loading: () => <BuilderSkeleton /> }
);

const MonacoEditor = dynamic(
  () => import('@/components/editor/YAMLEditor'),
  { ssr: false }
);
```

**Image Optimization:**
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-image.png"
  alt="Amplifier Architecture"
  width={1200}
  height={630}
  priority // Above the fold
/>
```

**Data Fetching:**
```typescript
// Use React Query for caching
import { useQuery } from '@tanstack/react-query';

export function useRecipeGallery() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## Backend Architecture

### Technology Stack

**Core:**
- **Framework:** FastAPI (Python 3.11+)
- **ASGI Server:** Uvicorn
- **Task Queue:** Celery + Redis
- **Database:** PostgreSQL 15
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Cache:** Redis
- **Storage:** S3-compatible (MinIO for dev)

**Security:**
- **Authentication:** GitHub OAuth 2.0
- **Authorization:** JWT tokens
- **Rate Limiting:** slowapi
- **Sandboxing:** Docker containers with resource limits
- **Validation:** Pydantic v2

**Observability:**
- **Logging:** structlog
- **Monitoring:** Prometheus + Grafana
- **Tracing:** OpenTelemetry
- **Error Tracking:** Sentry

### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── recipes.py
│   │   │   ├── execution.py
│   │   │   ├── gallery.py
│   │   │   ├── auth.py
│   │   │   └── users.py
│   │   └── deps.py           # Dependencies
│   │
│   ├── core/
│   │   ├── config.py         # Settings
│   │   ├── security.py       # Auth utilities
│   │   └── sandbox.py        # Sandbox manager
│   │
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── recipe.py
│   │   ├── execution.py
│   │   └── gallery.py
│   │
│   ├── schemas/              # Pydantic schemas
│   │   ├── recipe.py
│   │   ├── execution.py
│   │   └── user.py
│   │
│   ├── services/             # Business logic
│   │   ├── recipe_executor.py
│   │   ├── sandbox_manager.py
│   │   ├── gallery_manager.py
│   │   └── notification.py
│   │
│   ├── tasks/                # Celery tasks
│   │   └── execution.py
│   │
│   └── main.py               # FastAPI app
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── alembic/                  # Database migrations
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── scripts/
    ├── seed_data.py
    └── migrate.py
```

### Key API Endpoints

```python
# app/api/routes/recipes.py
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.recipe import Recipe, RecipeCreate
from app.services.recipe_executor import RecipeExecutor

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("/gallery")
async def list_recipes(
    category: str | None = None,
    difficulty: str | None = None,
    limit: int = 20,
):
    """Get recipes from gallery."""
    return await gallery_service.list_recipes(
        category=category,
        difficulty=difficulty,
        limit=limit
    )

@router.post("/execute")
async def execute_recipe(
    recipe: Recipe,
    inputs: dict,
    user = Depends(get_current_user),
):
    """Execute a recipe in sandbox."""
    # Rate limiting
    if not await rate_limiter.check(user.id):
        raise HTTPException(429, "Rate limit exceeded")
    
    # Create execution
    execution = await execution_service.create(
        recipe=recipe,
        inputs=inputs,
        user_id=user.id
    )
    
    # Queue for async execution
    task = execute_recipe_task.delay(execution.id)
    
    return {
        "execution_id": execution.id,
        "task_id": task.id,
        "status": "queued"
    }

@router.get("/executions/{execution_id}/stream")
async def stream_execution(execution_id: str):
    """WebSocket endpoint for real-time updates."""
    async def event_generator():
        async for event in execution_service.stream(execution_id):
            yield json.dumps(event)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
```

### Sandbox Architecture

**Isolation Strategy:**
```python
# app/core/sandbox.py
import docker
from contextlib import asynccontextmanager

class SandboxManager:
    """Manage isolated execution environments."""
    
    def __init__(self):
        self.client = docker.from_env()
        self.network = "amplifier_sandbox"
    
    @asynccontextmanager
    async def create_sandbox(self, execution_id: str):
        """Create isolated container for execution."""
        
        container = self.client.containers.run(
            image="amplifier-runtime:latest",
            name=f"exec-{execution_id}",
            detach=True,
            network=self.network,
            
            # Resource limits
            mem_limit="512m",
            cpu_period=100000,
            cpu_quota=50000,  # 50% of one CPU
            
            # Security
            security_opt=["no-new-privileges"],
            cap_drop=["ALL"],
            read_only=True,
            
            # Filesystem
            volumes={
                f"exec-{execution_id}": {
                    "bind": "/workspace",
                    "mode": "rw"
                }
            },
            
            # Timeout
            environment={
                "EXECUTION_ID": execution_id,
                "TIMEOUT": "300"  # 5 minutes
            }
        )
        
        try:
            yield container
        finally:
            container.stop()
            container.remove()
```

**Recipe Execution:**
```python
# app/services/recipe_executor.py
from amplifier_foundation import Bundle, Recipe

class RecipeExecutor:
    """Execute recipes in sandboxed environment."""
    
    async def execute(
        self,
        recipe: Recipe,
        inputs: dict,
        execution_id: str
    ):
        """Execute recipe and stream results."""
        
        async with sandbox_manager.create_sandbox(execution_id) as container:
            # Load bundle
            bundle = await Bundle.from_yaml(recipe.bundle)
            prepared = await bundle.prepare()
            
            # Create session
            async with prepared.create_session() as session:
                # Execute recipe steps
                context = inputs.copy()
                
                for step in recipe.steps:
                    # Emit step start event
                    await self.emit_event({
                        "type": "step:start",
                        "step_id": step.id,
                        "timestamp": datetime.utcnow()
                    })
                    
                    # Substitute context variables
                    prompt = self.substitute_vars(step.prompt, context)
                    
                    # Execute with agent
                    result = await session.execute(
                        prompt,
                        agent=step.agent,
                        mode=step.mode
                    )
                    
                    # Update context
                    if step.output:
                        context[step.output] = result
                    
                    # Emit step complete
                    await self.emit_event({
                        "type": "step:complete",
                        "step_id": step.id,
                        "output": result,
                        "timestamp": datetime.utcnow()
                    })
                
                return {
                    "status": "success",
                    "outputs": context
                }
```

### Database Schema

```python
# app/models/execution.py
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Enum
from app.models.base import Base

class Execution(Base):
    __tablename__ = "executions"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    recipe_id = Column(String, nullable=True)  # Null for ad-hoc
    
    recipe_yaml = Column(String)  # Snapshot of recipe
    inputs = Column(JSON)
    outputs = Column(JSON, nullable=True)
    
    status = Column(
        Enum("queued", "running", "completed", "failed"),
        default="queued"
    )
    
    error = Column(String, nullable=True)
    logs = Column(JSON, default=list)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
```

---

## Infrastructure & Deployment

### Development Environment

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/amplifier
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /var/run/docker.sock:/var/run/docker.sock  # For sandbox
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: amplifier
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
  
  worker:
    build: ./backend
    command: celery -A app.tasks worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/amplifier
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - db

volumes:
  postgres_data:
  redis_data:
```

### Production Deployment

**Frontend (Vercel):**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.amplifier.dev"
  }
}
```

**Backend (Fly.io):**
```toml
# fly.toml
app = "amplifier-api"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"

[[services]]
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
  
  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[services.concurrency]
  type = "requests"
  hard_limit = 200
  soft_limit = 100

[[services.http_checks]]
  interval = 10000
  timeout = 2000
  method = "GET"
  path = "/health"
```

### CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## Security Considerations

### Authentication & Authorization

**OAuth Flow:**
```python
# app/api/routes/auth.py
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
oauth.register(
    name='github',
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    authorize_url='https://github.com/login/oauth/authorize',
    access_token_url='https://github.com/login/oauth/access_token',
    client_kwargs={'scope': 'user:email'}
)

@router.get("/login/github")
async def github_login(request: Request):
    redirect_uri = request.url_for('github_callback')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/callback/github")
async def github_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)
    user_info = await oauth.github.get('user', token=token)
    
    # Create or update user
    user = await user_service.get_or_create(user_info)
    
    # Generate JWT
    access_token = create_access_token(user.id)
    
    return {"access_token": access_token, "token_type": "bearer"}
```

### Rate Limiting

```python
# app/core/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/execute")
@limiter.limit("10/minute")  # 10 executions per minute
async def execute_recipe(request: Request, ...):
    ...
```

### Input Validation

```python
# app/schemas/recipe.py
from pydantic import BaseModel, validator

class RecipeStep(BaseModel):
    id: str
    agent: str
    prompt: str
    output: str | None = None
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if len(v) > 10000:
            raise ValueError("Prompt too long")
        return v

class Recipe(BaseModel):
    name: str
    description: str
    steps: list[RecipeStep]
    
    @validator('steps')
    def validate_steps(cls, v):
        if len(v) == 0:
            raise ValueError("Recipe must have at least one step")
        if len(v) > 50:
            raise ValueError("Too many steps")
        return v
```

---

## Monitoring & Observability

### Logging

```python
# app/core/logging.py
import structlog

logger = structlog.get_logger()

# Usage
logger.info(
    "recipe_executed",
    recipe_id=recipe.id,
    user_id=user.id,
    duration_seconds=duration,
    status="success"
)
```

### Metrics

```python
# app/core/metrics.py
from prometheus_client import Counter, Histogram

recipe_executions = Counter(
    'recipe_executions_total',
    'Total recipe executions',
    ['status', 'recipe_id']
)

execution_duration = Histogram(
    'recipe_execution_duration_seconds',
    'Recipe execution duration'
)

# Usage
with execution_duration.time():
    result = await execute_recipe(recipe)
recipe_executions.labels(status=result.status, recipe_id=recipe.id).inc()
```

---

## Cost Estimation

### Infrastructure Costs (Monthly)

**Hosting:**
- Vercel (Frontend): $20 (Pro plan)
- Fly.io (Backend): $50 (2x shared-cpu-1x)
- PostgreSQL: $15 (managed DB)
- Redis: $10 (managed cache)
- S3 Storage: $5 (100GB)
- **Total: ~$100/month**

**LLM API Costs:**
- Depends on usage
- Estimate: $0.50 per recipe execution
- 1,000 executions/month = $500
- Budget: $1,000/month for beta

**Total Initial: ~$1,100/month**

**Scaling:**
- 10,000 users: ~$3,000/month
- 100,000 users: ~$15,000/month

---

## Performance Targets

### Response Times
- Homepage load: <2s
- Recipe execution start: <500ms
- Documentation page: <1s
- Builder interaction: <100ms (60fps)

### Throughput
- API requests: 1,000 req/sec
- Concurrent executions: 100
- WebSocket connections: 1,000

### Availability
- Uptime: 99.9% (43 minutes downtime/month)
- Error rate: <0.1%
- Mean time to recovery: <15 minutes
