import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type ExtendVideoRunwayExtendPostBodyParam = FromSchema<typeof schemas.ExtendVideoRunwayExtendPost.body>;
export type ExtendVideoRunwayExtendPostResponse200 = FromSchema<typeof schemas.ExtendVideoRunwayExtendPost.response['200']>;
export type ExtendVideoRunwayExtendPostResponse422 = FromSchema<typeof schemas.ExtendVideoRunwayExtendPost.response['422']>;
export type GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPostBodyParam = FromSchema<typeof schemas.GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPost.body>;
export type GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPostResponse200 = FromSchema<typeof schemas.GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPost.response['200']>;
export type GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPostResponse422 = FromSchema<typeof schemas.GenerateByImageAndDescriptionRunwayGenerateImageDescriptionPost.response['422']>;
export type GenerateByImageRunwayGenerateImagePostBodyParam = FromSchema<typeof schemas.GenerateByImageRunwayGenerateImagePost.body>;
export type GenerateByImageRunwayGenerateImagePostResponse200 = FromSchema<typeof schemas.GenerateByImageRunwayGenerateImagePost.response['200']>;
export type GenerateByImageRunwayGenerateImagePostResponse422 = FromSchema<typeof schemas.GenerateByImageRunwayGenerateImagePost.response['422']>;
export type GenerateByTextRunwayGenerateTextPostBodyParam = FromSchema<typeof schemas.GenerateByTextRunwayGenerateTextPost.body>;
export type GenerateByTextRunwayGenerateTextPostResponse200 = FromSchema<typeof schemas.GenerateByTextRunwayGenerateTextPost.response['200']>;
export type GenerateByTextRunwayGenerateTextPostResponse422 = FromSchema<typeof schemas.GenerateByTextRunwayGenerateTextPost.response['422']>;
export type GenerateByVideoRunwayGenerateVideoPostBodyParam = FromSchema<typeof schemas.GenerateByVideoRunwayGenerateVideoPost.body>;
export type GenerateByVideoRunwayGenerateVideoPostResponse200 = FromSchema<typeof schemas.GenerateByVideoRunwayGenerateVideoPost.response['200']>;
export type GenerateByVideoRunwayGenerateVideoPostResponse422 = FromSchema<typeof schemas.GenerateByVideoRunwayGenerateVideoPost.response['422']>;
export type GetTaskStatusRunwayStatusGetMetadataParam = FromSchema<typeof schemas.GetTaskStatusRunwayStatusGet.metadata>;
export type GetTaskStatusRunwayStatusGetResponse200 = FromSchema<typeof schemas.GetTaskStatusRunwayStatusGet.response['200']>;
export type GetTaskStatusRunwayStatusGetResponse422 = FromSchema<typeof schemas.GetTaskStatusRunwayStatusGet.response['422']>;
