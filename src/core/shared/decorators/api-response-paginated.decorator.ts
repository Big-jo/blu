// import { applyDecorators, Type } from '@nestjs/common';
// import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
// import { getSchemaPath } from '@nestjs/swagger/dist/utils/get-schema-path.util';
// import { PageDto } from '../../pagination/page.dto';

// export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
//   dataDto: DataDto,
//   options?: Omit<Parameters<typeof ApiOkResponse>[0], 'schema'>,
// ) =>
//   applyDecorators(
//     ApiExtraModels(PageDto, dataDto),
//     ApiOkResponse({
//       ...options,
//       schema: {
//         allOf: [
//           { $ref: getSchemaPath(PageDto) },
//           {
//             properties: {
//               data: {
//                 type: 'array',
//                 items: { $ref: getSchemaPath(dataDto) },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
