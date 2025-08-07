import { AttachmentDTO as AttachmentDTOInterface } from "../requestModels/model/attachmentDTO";
import { UserInstance } from "./UserInstance";

export class AttachmentInstance implements AttachmentDTOInterface {
  id?: number;
  filename: string;
  originalFilename: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  taskId?: number;
  uploadedBy?: UserInstance;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: AttachmentDTOInterface) {
    this.id = data.id;
    this.filename = data.filename;
    this.originalFilename = data.originalFilename;
    this.fileUrl = data.fileUrl;
    this.contentType = data.contentType;
    this.fileSize = data.fileSize;
    this.taskId = data.taskId;
    this.uploadedBy = data.uploadedBy
      ? new UserInstance(data.uploadedBy)
      : undefined;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
