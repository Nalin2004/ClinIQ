from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '77888d431d7a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # SQLite SAFE migration – only ADD COLUMN supported
    op.add_column(
        'users',
        sa.Column('role', sa.String(length=20), nullable=False, server_default='user')
    )


def downgrade():
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("role")
