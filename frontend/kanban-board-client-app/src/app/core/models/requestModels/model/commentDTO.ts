/**
 * Kanban API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserDTO } from './userDTO';


export interface CommentDTO { 
    id?: number;
    content?: string;
    createdAt?: Date;
    author?: UserDTO;
    taskId?: number;
}

