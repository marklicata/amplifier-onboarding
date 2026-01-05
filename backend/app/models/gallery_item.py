"""Gallery item model for pre-built content"""

from sqlalchemy import Column, String, Text, Boolean, Index, ARRAY
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base, TimestampMixin


class GalleryItem(Base, TimestampMixin):
    """Pre-built recipes, bundles, and skills"""

    __tablename__ = "gallery_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False, index=True)  # 'recipe', 'bundle', 'skill'
    name = Column(String(255), nullable=False)
    description = Column(Text)
    yaml = Column(Text, nullable=False)
    category = Column(String(100), index=True)
    min_mode = Column(String(50))  # Minimum mode required
    featured = Column(Boolean, default=False, index=True)
    tags = Column(ARRAY(Text))

    __table_args__ = (
        Index('idx_gallery_type', 'type'),
        Index('idx_gallery_category', 'category'),
        Index('idx_gallery_featured', 'featured'),
    )

    def __repr__(self):
        return f"<GalleryItem(id={self.id}, name={self.name}, type={self.type})>"
