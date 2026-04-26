export class CreateActivityLogDto {
  action!: string;
  employeeId!: string;
  resourceType!: string;
  resourceId!: string;
  payloadData!: Record<string, any>;
}
