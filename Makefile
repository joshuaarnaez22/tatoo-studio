.PHONY: prisma-generate prisma-push prisma-migrate prisma-studio

# Prisma commands
generate:
	pnpm prisma generate

push:
	pnpm prisma db push

migrate:
	pnpm prisma migrate dev

studio:
	pnpm prisma studio
