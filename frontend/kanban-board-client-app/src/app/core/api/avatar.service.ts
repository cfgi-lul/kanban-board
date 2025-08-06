import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInstance } from '../models/classes/UserInstance';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly baseUrl = '/api/avatar';

  constructor(private http: HttpClient) {}

  /**
   * Upload a new avatar image
   */
  uploadAvatar(file: File): Observable<UserInstance> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UserInstance>(`${this.baseUrl}/upload`, formData);
  }

  /**
   * Remove the current avatar
   */
  removeAvatar(): Observable<UserInstance> {
    return this.http.delete<UserInstance>(`${this.baseUrl}/remove`);
  }

  /**
   * Get avatar URL for a user
   */
  getAvatarUrl(avatarPath: string | null): string {
    if (!avatarPath) {
      return 'assets/default-avatar.svg';
    }

    return `${window.location.origin}/api/avatar/${avatarPath}`;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only image files are allowed (JPEG, PNG, GIF, WebP)',
      };
    }

    return { isValid: true };
  }
}
