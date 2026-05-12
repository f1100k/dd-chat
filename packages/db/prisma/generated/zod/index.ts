import type { Prisma } from "@prisma/client"
import { z } from "zod"

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
	"ReadUncommitted",
	"ReadCommitted",
	"RepeatableRead",
	"Serializable",
])

export const UserScalarFieldEnumSchema = z.enum(["id", "email", "username", "display_name"])

export const SortOrderSchema = z.enum(["asc", "desc"])

export const QueryModeSchema = z.enum(["default", "insensitive"])
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	id: z.uuid(),
	email: z.string(),
	username: z.string(),
	display_name: z.string(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
	.object({
		id: z.boolean().optional(),
		email: z.boolean().optional(),
		username: z.boolean().optional(),
		display_name: z.boolean().optional(),
	})
	.strict()

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
	AND: z
		.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
		.optional(),
	OR: z
		.lazy(() => UserWhereInputSchema)
		.array()
		.optional(),
	NOT: z
		.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
		.optional(),
	id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	email: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	username: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	display_name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
})

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		display_name: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z
	.union([
		z.object({
			id: z.uuid(),
			email: z.string(),
			username: z.string(),
		}),
		z.object({
			id: z.uuid(),
			email: z.string(),
		}),
		z.object({
			id: z.uuid(),
			username: z.string(),
		}),
		z.object({
			id: z.uuid(),
		}),
		z.object({
			email: z.string(),
			username: z.string(),
		}),
		z.object({
			email: z.string(),
		}),
		z.object({
			username: z.string(),
		}),
	])
	.and(
		z.strictObject({
			id: z.uuid().optional(),
			email: z.string().optional(),
			username: z.string().optional(),
			AND: z
				.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
				.optional(),
			OR: z
				.lazy(() => UserWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
				.optional(),
			display_name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		}),
	)

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		display_name: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
	})

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		email: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		username: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		display_name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
	})

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
	id: z.uuid().optional(),
	email: z.string(),
	username: z.string(),
	display_name: z.string(),
})

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		email: z.string(),
		username: z.string(),
		display_name: z.string(),
	})

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
	id: z.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	display_name: z
		.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
		.optional(),
})

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		username: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		display_name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
	id: z.uuid().optional(),
	email: z.string(),
	username: z.string(),
	display_name: z.string(),
})

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		username: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		display_name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		username: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		display_name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
	equals: z.string().optional(),
	in: z.string().array().optional(),
	notIn: z.string().array().optional(),
	lt: z.string().optional(),
	lte: z.string().optional(),
	gt: z.string().optional(),
	gte: z.string().optional(),
	contains: z.string().optional(),
	startsWith: z.string().optional(),
	endsWith: z.string().optional(),
	mode: z.lazy(() => QueryModeSchema).optional(),
	not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
})

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		display_name: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		display_name: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		username: z.lazy(() => SortOrderSchema).optional(),
		display_name: z.lazy(() => SortOrderSchema).optional(),
	})

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	})

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.string().optional(),
	})

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
	equals: z.string().optional(),
	in: z.string().array().optional(),
	notIn: z.string().array().optional(),
	lt: z.string().optional(),
	lte: z.string().optional(),
	gt: z.string().optional(),
	gte: z.string().optional(),
	contains: z.string().optional(),
	startsWith: z.string().optional(),
	endsWith: z.string().optional(),
	not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
})

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	})

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
	equals: z.number().optional(),
	in: z.number().array().optional(),
	notIn: z.number().array().optional(),
	lt: z.number().optional(),
	lte: z.number().optional(),
	gt: z.number().optional(),
	gte: z.number().optional(),
	not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
})

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict()

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict()

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict()

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema])
			.optional(),
		by: UserScalarFieldEnumSchema.array(),
		having: UserScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
	})
	.strict()

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereUniqueInputSchema,
		create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
		update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
	})
	.strict()

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z
	.object({
		data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z
	.object({
		data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
	.object({
		data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z
	.object({
		data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()
