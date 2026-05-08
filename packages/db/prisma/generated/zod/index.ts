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

export const UserScalarFieldEnumSchema = z.enum([
	"id",
	"email",
	"name",
	"emailVerified",
	"image",
	"createdAt",
	"updatedAt",
])

export const SessionScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"token",
	"expiresAt",
	"ipAddress",
	"userAgent",
	"createdAt",
	"updatedAt",
])

export const AccountScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"accountId",
	"providerId",
	"accessToken",
	"refreshToken",
	"idToken",
	"accessTokenExpiresAt",
	"refreshTokenExpiresAt",
	"scope",
	"password",
	"createdAt",
	"updatedAt",
])

export const VerificationScalarFieldEnumSchema = z.enum([
	"id",
	"identifier",
	"value",
	"expiresAt",
	"createdAt",
	"updatedAt",
])

export const ConversationScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"title",
	"createdAt",
	"updatedAt",
])

export const MessageScalarFieldEnumSchema = z.enum([
	"id",
	"conversationId",
	"role",
	"content",
	"selectedCategories",
	"injectedContext",
	"createdAt",
])

export const SortOrderSchema = z.enum(["asc", "desc"])

export const QueryModeSchema = z.enum(["default", "insensitive"])

export const NullsOrderSchema = z.enum(["first", "last"])

export const RoleSchema = z.enum(["USER", "ASSISTANT"])

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string().nullable(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	token: z.string(),
	expiresAt: z.coerce.date(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
	id: z.string(),
	userId: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	idToken: z.string().nullable(),
	accessTokenExpiresAt: z.coerce.date().nullable(),
	refreshTokenExpiresAt: z.coerce.date().nullable(),
	scope: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
	id: z.string(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// CONVERSATION SCHEMA
/////////////////////////////////////////

export const ConversationSchema = z.object({
	id: z.string(),
	userId: z.string(),
	title: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export type Conversation = z.infer<typeof ConversationSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
	role: RoleSchema,
	id: z.string(),
	conversationId: z.string(),
	content: z.string(),
	selectedCategories: z.string().array(),
	injectedContext: z.string().nullable(),
	createdAt: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z
	.object({
		conversations: z.union([z.boolean(), z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
		sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
		accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
	})
	.strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z
	.object({
		select: z.lazy(() => UserSelectSchema).optional(),
		include: z.lazy(() => UserIncludeSchema).optional(),
	})
	.strict()

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z
	.object({
		select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
	})
	.strict()

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z
	.object({
		conversations: z.boolean().optional(),
		sessions: z.boolean().optional(),
		accounts: z.boolean().optional(),
	})
	.strict()

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
	.object({
		id: z.boolean().optional(),
		email: z.boolean().optional(),
		name: z.boolean().optional(),
		emailVerified: z.boolean().optional(),
		image: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		conversations: z.union([z.boolean(), z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
		sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
		accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
	})
	.strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z
	.object({
		select: z.lazy(() => SessionSelectSchema).optional(),
		include: z.lazy(() => SessionIncludeSchema).optional(),
	})
	.strict()

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z
	.object({
		id: z.boolean().optional(),
		userId: z.boolean().optional(),
		token: z.boolean().optional(),
		expiresAt: z.boolean().optional(),
		ipAddress: z.boolean().optional(),
		userAgent: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z
	.object({
		select: z.lazy(() => AccountSelectSchema).optional(),
		include: z.lazy(() => AccountIncludeSchema).optional(),
	})
	.strict()

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z
	.object({
		id: z.boolean().optional(),
		userId: z.boolean().optional(),
		accountId: z.boolean().optional(),
		providerId: z.boolean().optional(),
		accessToken: z.boolean().optional(),
		refreshToken: z.boolean().optional(),
		idToken: z.boolean().optional(),
		accessTokenExpiresAt: z.boolean().optional(),
		refreshTokenExpiresAt: z.boolean().optional(),
		scope: z.boolean().optional(),
		password: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict()

// VERIFICATION
//------------------------------------------------------

export const VerificationSelectSchema: z.ZodType<Prisma.VerificationSelect> = z
	.object({
		id: z.boolean().optional(),
		identifier: z.boolean().optional(),
		value: z.boolean().optional(),
		expiresAt: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
	})
	.strict()

// CONVERSATION
//------------------------------------------------------

export const ConversationIncludeSchema: z.ZodType<Prisma.ConversationInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
		messages: z.union([z.boolean(), z.lazy(() => MessageFindManyArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => ConversationCountOutputTypeArgsSchema)]).optional(),
	})
	.strict()

export const ConversationArgsSchema: z.ZodType<Prisma.ConversationDefaultArgs> = z
	.object({
		select: z.lazy(() => ConversationSelectSchema).optional(),
		include: z.lazy(() => ConversationIncludeSchema).optional(),
	})
	.strict()

export const ConversationCountOutputTypeArgsSchema: z.ZodType<Prisma.ConversationCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z.lazy(() => ConversationCountOutputTypeSelectSchema).nullish(),
		})
		.strict()

export const ConversationCountOutputTypeSelectSchema: z.ZodType<Prisma.ConversationCountOutputTypeSelect> =
	z
		.object({
			messages: z.boolean().optional(),
		})
		.strict()

export const ConversationSelectSchema: z.ZodType<Prisma.ConversationSelect> = z
	.object({
		id: z.boolean().optional(),
		userId: z.boolean().optional(),
		title: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
		messages: z.union([z.boolean(), z.lazy(() => MessageFindManyArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => ConversationCountOutputTypeArgsSchema)]).optional(),
	})
	.strict()

// MESSAGE
//------------------------------------------------------

export const MessageIncludeSchema: z.ZodType<Prisma.MessageInclude> = z
	.object({
		conversation: z.union([z.boolean(), z.lazy(() => ConversationArgsSchema)]).optional(),
	})
	.strict()

export const MessageArgsSchema: z.ZodType<Prisma.MessageDefaultArgs> = z
	.object({
		select: z.lazy(() => MessageSelectSchema).optional(),
		include: z.lazy(() => MessageIncludeSchema).optional(),
	})
	.strict()

export const MessageSelectSchema: z.ZodType<Prisma.MessageSelect> = z
	.object({
		id: z.boolean().optional(),
		conversationId: z.boolean().optional(),
		role: z.boolean().optional(),
		content: z.boolean().optional(),
		selectedCategories: z.boolean().optional(),
		injectedContext: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		conversation: z.union([z.boolean(), z.lazy(() => ConversationArgsSchema)]).optional(),
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
	name: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	emailVerified: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
	image: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	conversations: z.lazy(() => ConversationListRelationFilterSchema).optional(),
	sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
	accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
})

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		name: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		conversations: z.lazy(() => ConversationOrderByRelationAggregateInputSchema).optional(),
		sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
		accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
	})

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z
	.union([
		z.object({
			id: z.string(),
			email: z.string(),
		}),
		z.object({
			id: z.string(),
		}),
		z.object({
			email: z.string(),
		}),
	])
	.and(
		z.strictObject({
			id: z.string().optional(),
			email: z.string().optional(),
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
			name: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			emailVerified: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
			image: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			conversations: z.lazy(() => ConversationListRelationFilterSchema).optional(),
			sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
			accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
		}),
	)

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		name: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
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
		name: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		emailVerified: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
		image: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.strictObject({
	AND: z
		.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
		.optional(),
	OR: z
		.lazy(() => SessionWhereInputSchema)
		.array()
		.optional(),
	NOT: z
		.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
		.optional(),
	id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	ipAddress: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	userAgent: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	user: z
		.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
		.optional(),
})

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		token: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		ipAddress: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		userAgent: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
	})

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z
	.union([
		z.object({
			id: z.string(),
			token: z.string(),
		}),
		z.object({
			id: z.string(),
		}),
		z.object({
			token: z.string(),
		}),
	])
	.and(
		z.strictObject({
			id: z.string().optional(),
			token: z.string().optional(),
			AND: z
				.union([
					z.lazy(() => SessionWhereInputSchema),
					z.lazy(() => SessionWhereInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => SessionWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => SessionWhereInputSchema),
					z.lazy(() => SessionWhereInputSchema).array(),
				])
				.optional(),
			userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			ipAddress: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			user: z
				.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
				.optional(),
		}),
	)

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		token: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		ipAddress: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		userAgent: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
	})

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
				z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SessionScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
				z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		token: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		expiresAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		ipAddress: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.strictObject({
	AND: z
		.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
		.optional(),
	OR: z
		.lazy(() => AccountWhereInputSchema)
		.array()
		.optional(),
	NOT: z
		.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
		.optional(),
	id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	accessToken: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	refreshToken: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	idToken: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	accessTokenExpiresAt: z
		.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
		.optional()
		.nullable(),
	refreshTokenExpiresAt: z
		.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
		.optional()
		.nullable(),
	scope: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	password: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	user: z
		.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
		.optional(),
})

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		accountId: z.lazy(() => SortOrderSchema).optional(),
		providerId: z.lazy(() => SortOrderSchema).optional(),
		accessToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		refreshToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		idToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		scope: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		password: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
	})

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z.strictObject({
			id: z.string().optional(),
			AND: z
				.union([
					z.lazy(() => AccountWhereInputSchema),
					z.lazy(() => AccountWhereInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => AccountWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => AccountWhereInputSchema),
					z.lazy(() => AccountWhereInputSchema).array(),
				])
				.optional(),
			userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			accessToken: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			idToken: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
			scope: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			password: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			user: z
				.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
				.optional(),
		}),
	)

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		accountId: z.lazy(() => SortOrderSchema).optional(),
		providerId: z.lazy(() => SortOrderSchema).optional(),
		accessToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		refreshToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		idToken: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		scope: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		password: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
	})

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
				z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AccountScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
				z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		accountId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		providerId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		accessToken: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		idToken: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		scope: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		password: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const VerificationWhereInputSchema: z.ZodType<Prisma.VerificationWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VerificationWhereInputSchema),
				z.lazy(() => VerificationWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VerificationWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VerificationWhereInputSchema),
				z.lazy(() => VerificationWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		value: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})

export const VerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		identifier: z.lazy(() => SortOrderSchema).optional(),
		value: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const VerificationWhereUniqueInputSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z.strictObject({
			id: z.string().optional(),
			AND: z
				.union([
					z.lazy(() => VerificationWhereInputSchema),
					z.lazy(() => VerificationWhereInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => VerificationWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => VerificationWhereInputSchema),
					z.lazy(() => VerificationWhereInputSchema).array(),
				])
				.optional(),
			identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			value: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		}),
	)

export const VerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		identifier: z.lazy(() => SortOrderSchema).optional(),
		value: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => VerificationCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => VerificationMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => VerificationMinOrderByAggregateInputSchema).optional(),
	})

export const VerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VerificationScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		identifier: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		value: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		expiresAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const ConversationWhereInputSchema: z.ZodType<Prisma.ConversationWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => ConversationWhereInputSchema),
				z.lazy(() => ConversationWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ConversationWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ConversationWhereInputSchema),
				z.lazy(() => ConversationWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		user: z
			.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
			.optional(),
		messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
	})

export const ConversationOrderByWithRelationInputSchema: z.ZodType<Prisma.ConversationOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		messages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional(),
	})

export const ConversationWhereUniqueInputSchema: z.ZodType<Prisma.ConversationWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z.strictObject({
			id: z.string().optional(),
			AND: z
				.union([
					z.lazy(() => ConversationWhereInputSchema),
					z.lazy(() => ConversationWhereInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => ConversationWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => ConversationWhereInputSchema),
					z.lazy(() => ConversationWhereInputSchema).array(),
				])
				.optional(),
			userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			user: z
				.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
				.optional(),
			messages: z.lazy(() => MessageListRelationFilterSchema).optional(),
		}),
	)

export const ConversationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConversationOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => ConversationCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => ConversationMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => ConversationMinOrderByAggregateInputSchema).optional(),
	})

export const ConversationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConversationScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ConversationScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		title: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const MessageWhereInputSchema: z.ZodType<Prisma.MessageWhereInput> = z.strictObject({
	AND: z
		.union([z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array()])
		.optional(),
	OR: z
		.lazy(() => MessageWhereInputSchema)
		.array()
		.optional(),
	NOT: z
		.union([z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array()])
		.optional(),
	id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	conversationId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	role: z.union([z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema)]).optional(),
	content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	selectedCategories: z.lazy(() => StringNullableListFilterSchema).optional(),
	injectedContext: z
		.union([z.lazy(() => StringNullableFilterSchema), z.string()])
		.optional()
		.nullable(),
	createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	conversation: z
		.union([
			z.lazy(() => ConversationScalarRelationFilterSchema),
			z.lazy(() => ConversationWhereInputSchema),
		])
		.optional(),
})

export const MessageOrderByWithRelationInputSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		conversationId: z.lazy(() => SortOrderSchema).optional(),
		role: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		selectedCategories: z.lazy(() => SortOrderSchema).optional(),
		injectedContext: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		conversation: z.lazy(() => ConversationOrderByWithRelationInputSchema).optional(),
	})

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z.strictObject({
			id: z.string().optional(),
			AND: z
				.union([
					z.lazy(() => MessageWhereInputSchema),
					z.lazy(() => MessageWhereInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => MessageWhereInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => MessageWhereInputSchema),
					z.lazy(() => MessageWhereInputSchema).array(),
				])
				.optional(),
			conversationId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			role: z.union([z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema)]).optional(),
			content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
			selectedCategories: z.lazy(() => StringNullableListFilterSchema).optional(),
			injectedContext: z
				.union([z.lazy(() => StringNullableFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
			conversation: z
				.union([
					z.lazy(() => ConversationScalarRelationFilterSchema),
					z.lazy(() => ConversationWhereInputSchema),
				])
				.optional(),
		}),
	)

export const MessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		conversationId: z.lazy(() => SortOrderSchema).optional(),
		role: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		selectedCategories: z.lazy(() => SortOrderSchema).optional(),
		injectedContext: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
			.optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => MessageCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => MessageMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => MessageMinOrderByAggregateInputSchema).optional(),
	})

export const MessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MessageScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),
				z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => MessageScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),
				z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		conversationId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		role: z
			.union([z.lazy(() => EnumRoleWithAggregatesFilterSchema), z.lazy(() => RoleSchema)])
			.optional(),
		content: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		selectedCategories: z.lazy(() => StringNullableListFilterSchema).optional(),
		injectedContext: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
			.optional(),
	})

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
	id: z.string(),
	email: z.string(),
	name: z.string().optional().nullable(),
	emailVerified: z.boolean().optional(),
	image: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional(),
	sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
	accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
})

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		conversations: z
			.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
		sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
	id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	name: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	emailVerified: z
		.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
		.optional(),
	image: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	createdAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	updatedAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional(),
	sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
	accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
})

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		conversations: z
			.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
	id: z.string(),
	email: z.string(),
	name: z.string().optional().nullable(),
	emailVerified: z.boolean().optional(),
	image: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
})

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.strictObject({
	id: z.string(),
	token: z.string(),
	expiresAt: z.coerce.date(),
	ipAddress: z.string().optional().nullable(),
	userAgent: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
})

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		token: z.string(),
		expiresAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.strictObject({
	id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	expiresAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	ipAddress: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	userAgent: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	createdAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	updatedAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
})

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		token: z.string(),
		expiresAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.strictObject({
	id: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	accessToken: z.string().optional().nullable(),
	refreshToken: z.string().optional().nullable(),
	idToken: z.string().optional().nullable(),
	accessTokenExpiresAt: z.coerce.date().optional().nullable(),
	refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
	scope: z.string().optional().nullable(),
	password: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
})

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.strictObject({
	id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	accountId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	providerId: z
		.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
		.optional(),
	accessToken: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	refreshToken: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	idToken: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	accessTokenExpiresAt: z
		.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	refreshTokenExpiresAt: z
		.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	scope: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	password: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	createdAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	updatedAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
})

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const VerificationCreateInputSchema: z.ZodType<Prisma.VerificationCreateInput> =
	z.strictObject({
		id: z.string(),
		identifier: z.string(),
		value: z.string(),
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const VerificationUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		identifier: z.string(),
		value: z.string(),
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const VerificationUpdateInputSchema: z.ZodType<Prisma.VerificationUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		identifier: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const VerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		identifier: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const VerificationCreateManyInputSchema: z.ZodType<Prisma.VerificationCreateManyInput> =
	z.strictObject({
		id: z.string(),
		identifier: z.string(),
		value: z.string(),
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const VerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		identifier: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const VerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		identifier: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const ConversationCreateInputSchema: z.ZodType<Prisma.ConversationCreateInput> =
	z.strictObject({
		id: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema),
		messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional(),
	})

export const ConversationUncheckedCreateInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		messages: z
			.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema)
			.optional(),
	})

export const ConversationUpdateInputSchema: z.ZodType<Prisma.ConversationUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutConversationsNestedInputSchema).optional(),
		messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional(),
	})

export const ConversationUncheckedUpdateInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		messages: z
			.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema)
			.optional(),
	})

export const ConversationCreateManyInputSchema: z.ZodType<Prisma.ConversationCreateManyInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const ConversationUpdateManyMutationInputSchema: z.ZodType<Prisma.ConversationUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const ConversationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.strictObject({
	id: z.string(),
	role: z.lazy(() => RoleSchema),
	content: z.string(),
	selectedCategories: z
		.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
		.optional(),
	injectedContext: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional(),
	conversation: z.lazy(() => ConversationCreateNestedOneWithoutMessagesInputSchema),
})

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> =
	z.strictObject({
		id: z.string(),
		conversationId: z.string(),
		role: z.lazy(() => RoleSchema),
		content: z.string(),
		selectedCategories: z
			.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
	})

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.strictObject({
	id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	role: z
		.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
		.optional(),
	content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	selectedCategories: z
		.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
		.optional(),
	injectedContext: z
		.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
		.optional()
		.nullable(),
	createdAt: z
		.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
		.optional(),
	conversation: z
		.lazy(() => ConversationUpdateOneRequiredWithoutMessagesNestedInputSchema)
		.optional(),
})

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		conversationId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> =
	z.strictObject({
		id: z.string(),
		conversationId: z.string(),
		role: z.lazy(() => RoleSchema),
		content: z.string(),
		selectedCategories: z
			.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
	})

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		conversationId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
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

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
	equals: z.string().optional().nullable(),
	in: z.string().array().optional().nullable(),
	notIn: z.string().array().optional().nullable(),
	lt: z.string().optional(),
	lte: z.string().optional(),
	gt: z.string().optional(),
	gte: z.string().optional(),
	contains: z.string().optional(),
	startsWith: z.string().optional(),
	endsWith: z.string().optional(),
	mode: z.lazy(() => QueryModeSchema).optional(),
	not: z
		.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
		.optional()
		.nullable(),
})

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
	equals: z.boolean().optional(),
	not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
})

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
	equals: z.coerce.date().optional(),
	in: z.coerce.date().array().optional(),
	notIn: z.coerce.date().array().optional(),
	lt: z.coerce.date().optional(),
	lte: z.coerce.date().optional(),
	gt: z.coerce.date().optional(),
	gte: z.coerce.date().optional(),
	not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
})

export const ConversationListRelationFilterSchema: z.ZodType<Prisma.ConversationListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => ConversationWhereInputSchema).optional(),
		some: z.lazy(() => ConversationWhereInputSchema).optional(),
		none: z.lazy(() => ConversationWhereInputSchema).optional(),
	})

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => SessionWhereInputSchema).optional(),
		some: z.lazy(() => SessionWhereInputSchema).optional(),
		none: z.lazy(() => SessionWhereInputSchema).optional(),
	})

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => AccountWhereInputSchema).optional(),
		some: z.lazy(() => AccountWhereInputSchema).optional(),
		none: z.lazy(() => AccountWhereInputSchema).optional(),
	})

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
	sort: z.lazy(() => SortOrderSchema),
	nulls: z.lazy(() => NullsOrderSchema).optional(),
})

export const ConversationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ConversationOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	})

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	})

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
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

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
	})

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> =
	z.strictObject({
		equals: z.boolean().optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedBoolFilterSchema).optional(),
		_max: z.lazy(() => NestedBoolFilterSchema).optional(),
	})

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	})

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => UserWhereInputSchema).optional(),
		isNot: z.lazy(() => UserWhereInputSchema).optional(),
	})

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		token: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		ipAddress: z.lazy(() => SortOrderSchema).optional(),
		userAgent: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		token: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		ipAddress: z.lazy(() => SortOrderSchema).optional(),
		userAgent: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		token: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		ipAddress: z.lazy(() => SortOrderSchema).optional(),
		userAgent: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		accountId: z.lazy(() => SortOrderSchema).optional(),
		providerId: z.lazy(() => SortOrderSchema).optional(),
		accessToken: z.lazy(() => SortOrderSchema).optional(),
		refreshToken: z.lazy(() => SortOrderSchema).optional(),
		idToken: z.lazy(() => SortOrderSchema).optional(),
		accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		scope: z.lazy(() => SortOrderSchema).optional(),
		password: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		accountId: z.lazy(() => SortOrderSchema).optional(),
		providerId: z.lazy(() => SortOrderSchema).optional(),
		accessToken: z.lazy(() => SortOrderSchema).optional(),
		refreshToken: z.lazy(() => SortOrderSchema).optional(),
		idToken: z.lazy(() => SortOrderSchema).optional(),
		accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		scope: z.lazy(() => SortOrderSchema).optional(),
		password: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		accountId: z.lazy(() => SortOrderSchema).optional(),
		providerId: z.lazy(() => SortOrderSchema).optional(),
		accessToken: z.lazy(() => SortOrderSchema).optional(),
		refreshToken: z.lazy(() => SortOrderSchema).optional(),
		idToken: z.lazy(() => SortOrderSchema).optional(),
		accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
		scope: z.lazy(() => SortOrderSchema).optional(),
		password: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
	})

export const VerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		identifier: z.lazy(() => SortOrderSchema).optional(),
		value: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const VerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		identifier: z.lazy(() => SortOrderSchema).optional(),
		value: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const VerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		identifier: z.lazy(() => SortOrderSchema).optional(),
		value: z.lazy(() => SortOrderSchema).optional(),
		expiresAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => MessageWhereInputSchema).optional(),
		some: z.lazy(() => MessageWhereInputSchema).optional(),
		none: z.lazy(() => MessageWhereInputSchema).optional(),
	})

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	})

export const ConversationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const ConversationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const ConversationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.strictObject({
	equals: z.lazy(() => RoleSchema).optional(),
	in: z
		.lazy(() => RoleSchema)
		.array()
		.optional(),
	notIn: z
		.lazy(() => RoleSchema)
		.array()
		.optional(),
	not: z.union([z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema)]).optional(),
})

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> =
	z.strictObject({
		equals: z.string().array().optional().nullable(),
		has: z.string().optional().nullable(),
		hasEvery: z.string().array().optional(),
		hasSome: z.string().array().optional(),
		isEmpty: z.boolean().optional(),
	})

export const ConversationScalarRelationFilterSchema: z.ZodType<Prisma.ConversationScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => ConversationWhereInputSchema).optional(),
		isNot: z.lazy(() => ConversationWhereInputSchema).optional(),
	})

export const MessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		conversationId: z.lazy(() => SortOrderSchema).optional(),
		role: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		selectedCategories: z.lazy(() => SortOrderSchema).optional(),
		injectedContext: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		conversationId: z.lazy(() => SortOrderSchema).optional(),
		role: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		injectedContext: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		conversationId: z.lazy(() => SortOrderSchema).optional(),
		role: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		injectedContext: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
	})

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => RoleSchema).optional(),
		in: z
			.lazy(() => RoleSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => RoleSchema)
			.array()
			.optional(),
		not: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
	})

export const ConversationCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutUserInputSchema),
				z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const ConversationUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutUserInputSchema),
				z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.string().optional(),
	})

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.string().optional().nullable(),
	})

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.boolean().optional(),
	})

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.coerce.date().optional(),
	})

export const ConversationUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutUserInputSchema),
				z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ConversationScalarWhereInputSchema),
				z.lazy(() => ConversationScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const ConversationUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutUserInputSchema),
				z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ConversationWhereUniqueInputSchema),
				z.lazy(() => ConversationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ConversationScalarWhereInputSchema),
				z.lazy(() => ConversationScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputSchema),
				z.lazy(() => SessionWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => AccountWhereUniqueInputSchema),
				z.lazy(() => AccountWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	})

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),
				z.lazy(() => UserUpdateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
			])
			.optional(),
	})

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	})

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.coerce.date().optional().nullable(),
	})

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),
				z.lazy(() => UserUpdateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
			])
			.optional(),
	})

export const UserCreateNestedOneWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutConversationsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutConversationsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConversationsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	})

export const MessageCreateNestedManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutConversationInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => MessageCreateWithoutConversationInputSchema),
				z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const MessageUncheckedCreateNestedManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => MessageCreateWithoutConversationInputSchema),
				z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
	})

export const UserUpdateOneRequiredWithoutConversationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutConversationsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutConversationsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConversationsInputSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutConversationsInputSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutConversationsInputSchema),
				z.lazy(() => UserUpdateWithoutConversationsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema),
			])
			.optional(),
	})

export const MessageUpdateManyWithoutConversationNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutConversationNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => MessageCreateWithoutConversationInputSchema),
				z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema),
				z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema),
				z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema),
				z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => MessageScalarWhereInputSchema),
				z.lazy(() => MessageScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const MessageUncheckedUpdateManyWithoutConversationNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => MessageCreateWithoutConversationInputSchema),
				z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
				z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),
				z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema),
				z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => MessageWhereUniqueInputSchema),
				z.lazy(() => MessageWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema),
				z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema),
				z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => MessageScalarWhereInputSchema),
				z.lazy(() => MessageScalarWhereInputSchema).array(),
			])
			.optional(),
	})

export const MessageCreateselectedCategoriesInputSchema: z.ZodType<Prisma.MessageCreateselectedCategoriesInput> =
	z.strictObject({
		set: z.string().array(),
	})

export const ConversationCreateNestedOneWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateNestedOneWithoutMessagesInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutMessagesInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutMessagesInputSchema).optional(),
		connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional(),
	})

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.lazy(() => RoleSchema).optional(),
	})

export const MessageUpdateselectedCategoriesInputSchema: z.ZodType<Prisma.MessageUpdateselectedCategoriesInput> =
	z.strictObject({
		set: z.string().array().optional(),
		push: z.union([z.string(), z.string().array()]).optional(),
	})

export const ConversationUpdateOneRequiredWithoutMessagesNestedInputSchema: z.ZodType<Prisma.ConversationUpdateOneRequiredWithoutMessagesNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => ConversationCreateWithoutMessagesInputSchema),
				z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutMessagesInputSchema).optional(),
		upsert: z.lazy(() => ConversationUpsertWithoutMessagesInputSchema).optional(),
		connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(() => ConversationUpdateToOneWithWhereWithoutMessagesInputSchema),
				z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),
				z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema),
			])
			.optional(),
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

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	})

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
	equals: z.boolean().optional(),
	not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
})

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
	equals: z.coerce.date().optional(),
	in: z.coerce.date().array().optional(),
	notIn: z.coerce.date().array().optional(),
	lt: z.coerce.date().optional(),
	lte: z.coerce.date().optional(),
	gt: z.coerce.date().optional(),
	gte: z.coerce.date().optional(),
	not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
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

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
	})

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
	z.strictObject({
		equals: z.number().optional().nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
			.optional()
			.nullable(),
	})

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
	z.strictObject({
		equals: z.boolean().optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedBoolFilterSchema).optional(),
		_max: z.lazy(() => NestedBoolFilterSchema).optional(),
	})

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	})

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
	})

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.strictObject({
	equals: z.lazy(() => RoleSchema).optional(),
	in: z
		.lazy(() => RoleSchema)
		.array()
		.optional(),
	notIn: z
		.lazy(() => RoleSchema)
		.array()
		.optional(),
	not: z.union([z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema)]).optional(),
})

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => RoleSchema).optional(),
		in: z
			.lazy(() => RoleSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => RoleSchema)
			.array()
			.optional(),
		not: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
	})

export const ConversationCreateWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional(),
	})

export const ConversationUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		messages: z
			.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema)
			.optional(),
	})

export const ConversationCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => ConversationWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => ConversationCreateWithoutUserInputSchema),
			z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const ConversationCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ConversationCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => ConversationCreateManyUserInputSchema),
			z.lazy(() => ConversationCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		token: z.string(),
		expiresAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		token: z.string(),
		expiresAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => SessionWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => SessionCreateWithoutUserInputSchema),
			z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => SessionCreateManyUserInputSchema),
			z.lazy(() => SessionCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => AccountWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => AccountCreateWithoutUserInputSchema),
			z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => AccountCreateManyUserInputSchema),
			z.lazy(() => AccountCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})

export const ConversationUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => ConversationWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => ConversationUpdateWithoutUserInputSchema),
			z.lazy(() => ConversationUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => ConversationCreateWithoutUserInputSchema),
			z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const ConversationUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => ConversationWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => ConversationUpdateWithoutUserInputSchema),
			z.lazy(() => ConversationUncheckedUpdateWithoutUserInputSchema),
		]),
	})

export const ConversationUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => ConversationScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => ConversationUpdateManyMutationInputSchema),
			z.lazy(() => ConversationUncheckedUpdateManyWithoutUserInputSchema),
		]),
	})

export const ConversationScalarWhereInputSchema: z.ZodType<Prisma.ConversationScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => ConversationScalarWhereInputSchema),
				z.lazy(() => ConversationScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => ConversationScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => ConversationScalarWhereInputSchema),
				z.lazy(() => ConversationScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => SessionWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => SessionUpdateWithoutUserInputSchema),
			z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => SessionCreateWithoutUserInputSchema),
			z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => SessionWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => SessionUpdateWithoutUserInputSchema),
			z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
		]),
	})

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => SessionScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => SessionUpdateManyMutationInputSchema),
			z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema),
		]),
	})

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SessionScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		ipAddress: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => AccountWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => AccountUpdateWithoutUserInputSchema),
			z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => AccountCreateWithoutUserInputSchema),
			z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
		]),
	})

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => AccountWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => AccountUpdateWithoutUserInputSchema),
			z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
		]),
	})

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => AccountScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => AccountUpdateManyMutationInputSchema),
			z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema),
		]),
	})

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AccountScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accessToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		idToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		scope: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		password: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		conversations: z
			.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
		accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutSessionsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
		]),
	})

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutSessionsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutSessionsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	})

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutSessionsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
		]),
	})

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		conversations: z
			.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional(),
		sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		conversations: z
			.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
		sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutAccountsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
		]),
	})

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutAccountsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutAccountsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	})

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutAccountsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
		]),
	})

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional(),
		sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		conversations: z
			.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserCreateWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateWithoutConversationsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserUncheckedCreateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutConversationsInput> =
	z.strictObject({
		id: z.string(),
		email: z.string(),
		name: z.string().optional().nullable(),
		emailVerified: z.boolean().optional(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
	})

export const UserCreateOrConnectWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutConversationsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutConversationsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema),
		]),
	})

export const MessageCreateWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateWithoutConversationInput> =
	z.strictObject({
		id: z.string(),
		role: z.lazy(() => RoleSchema),
		content: z.string(),
		selectedCategories: z
			.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
	})

export const MessageUncheckedCreateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutConversationInput> =
	z.strictObject({
		id: z.string(),
		role: z.lazy(() => RoleSchema),
		content: z.string(),
		selectedCategories: z
			.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
	})

export const MessageCreateOrConnectWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutConversationInput> =
	z.strictObject({
		where: z.lazy(() => MessageWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => MessageCreateWithoutConversationInputSchema),
			z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
		]),
	})

export const MessageCreateManyConversationInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyConversationInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => MessageCreateManyConversationInputSchema),
			z.lazy(() => MessageCreateManyConversationInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})

export const UserUpsertWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutConversationsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutConversationsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutConversationsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	})

export const UserUpdateToOneWithWhereWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutConversationsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutConversationsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema),
		]),
	})

export const UserUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutConversationsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const UserUncheckedUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutConversationsInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
	})

export const MessageUpsertWithWhereUniqueWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutConversationInput> =
	z.strictObject({
		where: z.lazy(() => MessageWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => MessageUpdateWithoutConversationInputSchema),
			z.lazy(() => MessageUncheckedUpdateWithoutConversationInputSchema),
		]),
		create: z.union([
			z.lazy(() => MessageCreateWithoutConversationInputSchema),
			z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),
		]),
	})

export const MessageUpdateWithWhereUniqueWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutConversationInput> =
	z.strictObject({
		where: z.lazy(() => MessageWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => MessageUpdateWithoutConversationInputSchema),
			z.lazy(() => MessageUncheckedUpdateWithoutConversationInputSchema),
		]),
	})

export const MessageUpdateManyWithWhereWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutConversationInput> =
	z.strictObject({
		where: z.lazy(() => MessageScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => MessageUpdateManyMutationInputSchema),
			z.lazy(() => MessageUncheckedUpdateManyWithoutConversationInputSchema),
		]),
	})

export const MessageScalarWhereInputSchema: z.ZodType<Prisma.MessageScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => MessageScalarWhereInputSchema),
				z.lazy(() => MessageScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => MessageScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => MessageScalarWhereInputSchema),
				z.lazy(() => MessageScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		conversationId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		role: z.union([z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema)]).optional(),
		content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		selectedCategories: z.lazy(() => StringNullableListFilterSchema).optional(),
		injectedContext: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})

export const ConversationCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateWithoutMessagesInput> =
	z.strictObject({
		id: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema),
	})

export const ConversationUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutMessagesInput> =
	z.strictObject({
		id: z.string(),
		userId: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const ConversationCreateOrConnectWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutMessagesInput> =
	z.strictObject({
		where: z.lazy(() => ConversationWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => ConversationCreateWithoutMessagesInputSchema),
			z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema),
		]),
	})

export const ConversationUpsertWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpsertWithoutMessagesInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),
			z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema),
		]),
		create: z.union([
			z.lazy(() => ConversationCreateWithoutMessagesInputSchema),
			z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema),
		]),
		where: z.lazy(() => ConversationWhereInputSchema).optional(),
	})

export const ConversationUpdateToOneWithWhereWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpdateToOneWithWhereWithoutMessagesInput> =
	z.strictObject({
		where: z.lazy(() => ConversationWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),
			z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema),
		]),
	})

export const ConversationUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutMessagesInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutConversationsNestedInputSchema).optional(),
	})

export const ConversationUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutMessagesInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const ConversationCreateManyUserInputSchema: z.ZodType<Prisma.ConversationCreateManyUserInput> =
	z.strictObject({
		id: z.string(),
		title: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> =
	z.strictObject({
		id: z.string(),
		token: z.string(),
		expiresAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> =
	z.strictObject({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})

export const ConversationUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional(),
	})

export const ConversationUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		messages: z
			.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema)
			.optional(),
	})

export const ConversationUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageCreateManyConversationInputSchema: z.ZodType<Prisma.MessageCreateManyConversationInput> =
	z.strictObject({
		id: z.string(),
		role: z.lazy(() => RoleSchema),
		content: z.string(),
		selectedCategories: z
			.union([z.lazy(() => MessageCreateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z.string().optional().nullable(),
		createdAt: z.coerce.date().optional(),
	})

export const MessageUpdateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateWithoutConversationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageUncheckedUpdateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutConversationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

export const MessageUncheckedUpdateManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutConversationInput> =
	z.strictObject({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		role: z
			.union([z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema)])
			.optional(),
		content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		selectedCategories: z
			.union([z.lazy(() => MessageUpdateselectedCategoriesInputSchema), z.string().array()])
			.optional(),
		injectedContext: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
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
		include: UserIncludeSchema.optional(),
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
		include: UserIncludeSchema.optional(),
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
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([
				SessionOrderByWithAggregationInputSchema.array(),
				SessionOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: SessionScalarFieldEnumSchema.array(),
		having: SessionScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict()

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict()

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([
				AccountOrderByWithAggregationInputSchema.array(),
				AccountOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: AccountScalarFieldEnumSchema.array(),
		having: AccountScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict()

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict()

export const VerificationFindFirstArgsSchema: z.ZodType<Prisma.VerificationFindFirstArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const VerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindFirstOrThrowArgs> =
	z
		.object({
			select: VerificationSelectSchema.optional(),
			where: VerificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					VerificationOrderByWithRelationInputSchema.array(),
					VerificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VerificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict()

export const VerificationFindManyArgsSchema: z.ZodType<Prisma.VerificationFindManyArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const VerificationAggregateArgsSchema: z.ZodType<Prisma.VerificationAggregateArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const VerificationGroupByArgsSchema: z.ZodType<Prisma.VerificationGroupByArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithAggregationInputSchema.array(),
				VerificationOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: VerificationScalarFieldEnumSchema.array(),
		having: VerificationScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const VerificationFindUniqueArgsSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict()

export const VerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> =
	z
		.object({
			select: VerificationSelectSchema.optional(),
			where: VerificationWhereUniqueInputSchema,
		})
		.strict()

export const ConversationFindFirstArgsSchema: z.ZodType<Prisma.ConversationFindFirstArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		where: ConversationWhereInputSchema.optional(),
		orderBy: z
			.union([
				ConversationOrderByWithRelationInputSchema.array(),
				ConversationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: ConversationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([ConversationScalarFieldEnumSchema, ConversationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const ConversationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConversationFindFirstOrThrowArgs> =
	z
		.object({
			select: ConversationSelectSchema.optional(),
			include: ConversationIncludeSchema.optional(),
			where: ConversationWhereInputSchema.optional(),
			orderBy: z
				.union([
					ConversationOrderByWithRelationInputSchema.array(),
					ConversationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: ConversationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([ConversationScalarFieldEnumSchema, ConversationScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict()

export const ConversationFindManyArgsSchema: z.ZodType<Prisma.ConversationFindManyArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		where: ConversationWhereInputSchema.optional(),
		orderBy: z
			.union([
				ConversationOrderByWithRelationInputSchema.array(),
				ConversationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: ConversationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([ConversationScalarFieldEnumSchema, ConversationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const ConversationAggregateArgsSchema: z.ZodType<Prisma.ConversationAggregateArgs> = z
	.object({
		where: ConversationWhereInputSchema.optional(),
		orderBy: z
			.union([
				ConversationOrderByWithRelationInputSchema.array(),
				ConversationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: ConversationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const ConversationGroupByArgsSchema: z.ZodType<Prisma.ConversationGroupByArgs> = z
	.object({
		where: ConversationWhereInputSchema.optional(),
		orderBy: z
			.union([
				ConversationOrderByWithAggregationInputSchema.array(),
				ConversationOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: ConversationScalarFieldEnumSchema.array(),
		having: ConversationScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const ConversationFindUniqueArgsSchema: z.ZodType<Prisma.ConversationFindUniqueArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		where: ConversationWhereUniqueInputSchema,
	})
	.strict()

export const ConversationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConversationFindUniqueOrThrowArgs> =
	z
		.object({
			select: ConversationSelectSchema.optional(),
			include: ConversationIncludeSchema.optional(),
			where: ConversationWhereUniqueInputSchema,
		})
		.strict()

export const MessageFindFirstArgsSchema: z.ZodType<Prisma.MessageFindFirstArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereInputSchema.optional(),
		orderBy: z
			.union([MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema])
			.optional(),
		cursor: MessageWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const MessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MessageFindFirstOrThrowArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereInputSchema.optional(),
		orderBy: z
			.union([MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema])
			.optional(),
		cursor: MessageWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const MessageFindManyArgsSchema: z.ZodType<Prisma.MessageFindManyArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereInputSchema.optional(),
		orderBy: z
			.union([MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema])
			.optional(),
		cursor: MessageWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict()

export const MessageAggregateArgsSchema: z.ZodType<Prisma.MessageAggregateArgs> = z
	.object({
		where: MessageWhereInputSchema.optional(),
		orderBy: z
			.union([MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema])
			.optional(),
		cursor: MessageWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const MessageGroupByArgsSchema: z.ZodType<Prisma.MessageGroupByArgs> = z
	.object({
		where: MessageWhereInputSchema.optional(),
		orderBy: z
			.union([
				MessageOrderByWithAggregationInputSchema.array(),
				MessageOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: MessageScalarFieldEnumSchema.array(),
		having: MessageScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict()

export const MessageFindUniqueArgsSchema: z.ZodType<Prisma.MessageFindUniqueArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereUniqueInputSchema,
	})
	.strict()

export const MessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MessageFindUniqueOrThrowArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereUniqueInputSchema,
	})
	.strict()

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
	})
	.strict()

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
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
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict()

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
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

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		data: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
	})
	.strict()

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
		create: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
		update: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
	})
	.strict()

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z
	.object({
		data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict()

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict()

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		data: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
		where: SessionWhereUniqueInputSchema,
	})
	.strict()

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z
	.object({
		data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
		where: SessionWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
			where: SessionWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict()

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		data: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
	})
	.strict()

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
		create: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
		update: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
	})
	.strict()

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z
	.object({
		data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict()

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict()

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		data: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
		where: AccountWhereUniqueInputSchema,
	})
	.strict()

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z
	.object({
		data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
		where: AccountWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
			where: AccountWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict()

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const VerificationCreateArgsSchema: z.ZodType<Prisma.VerificationCreateArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		data: z.union([VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema]),
	})
	.strict()

export const VerificationUpsertArgsSchema: z.ZodType<Prisma.VerificationUpsertArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
		create: z.union([VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema]),
		update: z.union([VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema]),
	})
	.strict()

export const VerificationCreateManyArgsSchema: z.ZodType<Prisma.VerificationCreateManyArgs> = z
	.object({
		data: z.union([VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const VerificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict()

export const VerificationDeleteArgsSchema: z.ZodType<Prisma.VerificationDeleteArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict()

export const VerificationUpdateArgsSchema: z.ZodType<Prisma.VerificationUpdateArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		data: z.union([VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema]),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict()

export const VerificationUpdateManyArgsSchema: z.ZodType<Prisma.VerificationUpdateManyArgs> = z
	.object({
		data: z.union([
			VerificationUpdateManyMutationInputSchema,
			VerificationUncheckedUpdateManyInputSchema,
		]),
		where: VerificationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const VerificationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VerificationUpdateManyMutationInputSchema,
				VerificationUncheckedUpdateManyInputSchema,
			]),
			where: VerificationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict()

export const VerificationDeleteManyArgsSchema: z.ZodType<Prisma.VerificationDeleteManyArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const ConversationCreateArgsSchema: z.ZodType<Prisma.ConversationCreateArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		data: z.union([ConversationCreateInputSchema, ConversationUncheckedCreateInputSchema]),
	})
	.strict()

export const ConversationUpsertArgsSchema: z.ZodType<Prisma.ConversationUpsertArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		where: ConversationWhereUniqueInputSchema,
		create: z.union([ConversationCreateInputSchema, ConversationUncheckedCreateInputSchema]),
		update: z.union([ConversationUpdateInputSchema, ConversationUncheckedUpdateInputSchema]),
	})
	.strict()

export const ConversationCreateManyArgsSchema: z.ZodType<Prisma.ConversationCreateManyArgs> = z
	.object({
		data: z.union([ConversationCreateManyInputSchema, ConversationCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const ConversationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ConversationCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([ConversationCreateManyInputSchema, ConversationCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict()

export const ConversationDeleteArgsSchema: z.ZodType<Prisma.ConversationDeleteArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		where: ConversationWhereUniqueInputSchema,
	})
	.strict()

export const ConversationUpdateArgsSchema: z.ZodType<Prisma.ConversationUpdateArgs> = z
	.object({
		select: ConversationSelectSchema.optional(),
		include: ConversationIncludeSchema.optional(),
		data: z.union([ConversationUpdateInputSchema, ConversationUncheckedUpdateInputSchema]),
		where: ConversationWhereUniqueInputSchema,
	})
	.strict()

export const ConversationUpdateManyArgsSchema: z.ZodType<Prisma.ConversationUpdateManyArgs> = z
	.object({
		data: z.union([
			ConversationUpdateManyMutationInputSchema,
			ConversationUncheckedUpdateManyInputSchema,
		]),
		where: ConversationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const ConversationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ConversationUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				ConversationUpdateManyMutationInputSchema,
				ConversationUncheckedUpdateManyInputSchema,
			]),
			where: ConversationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict()

export const ConversationDeleteManyArgsSchema: z.ZodType<Prisma.ConversationDeleteManyArgs> = z
	.object({
		where: ConversationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const MessageCreateArgsSchema: z.ZodType<Prisma.MessageCreateArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		data: z.union([MessageCreateInputSchema, MessageUncheckedCreateInputSchema]),
	})
	.strict()

export const MessageUpsertArgsSchema: z.ZodType<Prisma.MessageUpsertArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereUniqueInputSchema,
		create: z.union([MessageCreateInputSchema, MessageUncheckedCreateInputSchema]),
		update: z.union([MessageUpdateInputSchema, MessageUncheckedUpdateInputSchema]),
	})
	.strict()

export const MessageCreateManyArgsSchema: z.ZodType<Prisma.MessageCreateManyArgs> = z
	.object({
		data: z.union([MessageCreateManyInputSchema, MessageCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict()

export const MessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([MessageCreateManyInputSchema, MessageCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict()

export const MessageDeleteArgsSchema: z.ZodType<Prisma.MessageDeleteArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		where: MessageWhereUniqueInputSchema,
	})
	.strict()

export const MessageUpdateArgsSchema: z.ZodType<Prisma.MessageUpdateArgs> = z
	.object({
		select: MessageSelectSchema.optional(),
		include: MessageIncludeSchema.optional(),
		data: z.union([MessageUpdateInputSchema, MessageUncheckedUpdateInputSchema]),
		where: MessageWhereUniqueInputSchema,
	})
	.strict()

export const MessageUpdateManyArgsSchema: z.ZodType<Prisma.MessageUpdateManyArgs> = z
	.object({
		data: z.union([MessageUpdateManyMutationInputSchema, MessageUncheckedUpdateManyInputSchema]),
		where: MessageWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()

export const MessageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([MessageUpdateManyMutationInputSchema, MessageUncheckedUpdateManyInputSchema]),
			where: MessageWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict()

export const MessageDeleteManyArgsSchema: z.ZodType<Prisma.MessageDeleteManyArgs> = z
	.object({
		where: MessageWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict()
