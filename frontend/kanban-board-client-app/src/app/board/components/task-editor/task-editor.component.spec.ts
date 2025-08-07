import { CommentService } from "../../../core/api/comment.service";
import { TaskService } from "../../../core/api/task.service";
import { of } from "rxjs";

describe("TaskEditorComponent Services", () => {
  let mockCommentService: jest.Mocked<CommentService>;
  let mockTaskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    mockCommentService = {
      getComments: jest.fn(),
      createComment: jest.fn(),
    } as unknown as jest.Mocked<CommentService>;

    mockTaskService = {
      updateTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    // Setup default return values
    mockCommentService.getComments.mockReturnValue(of([]));
    mockTaskService.updateTask.mockReturnValue(of({}));
  });

  it("should create comment service mock", () => {
    expect(mockCommentService).toBeDefined();
    expect(mockCommentService.getComments).toBeDefined();
    expect(mockCommentService.createComment).toBeDefined();
  });

  it("should create task service mock", () => {
    expect(mockTaskService).toBeDefined();
    expect(mockTaskService.updateTask).toBeDefined();
  });

  it("should mock comment creation", () => {
    const testComment = { content: "Test comment", taskId: 1 };
    mockCommentService.createComment.mockReturnValue(of({}));

    mockCommentService.createComment(testComment).subscribe(() => {
      expect(mockCommentService.createComment).toHaveBeenCalledWith(
        testComment,
      );
    });
  });
});
