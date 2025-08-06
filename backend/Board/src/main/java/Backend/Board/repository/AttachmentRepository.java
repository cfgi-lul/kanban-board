package Backend.Board.repository;

import Backend.Board.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    
    /**
     * Find all attachments by task ID
     */
    List<Attachment> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    /**
     * Find attachments by uploaded user ID
     */
    List<Attachment> findByUploadedByIdOrderByCreatedAtDesc(Long uploadedById);
    
    /**
     * Find attachments by content type
     */
    List<Attachment> findByContentType(String contentType);
    
    /**
     * Find attachments by file size range
     */
    @Query("SELECT a FROM Attachment a WHERE a.fileSize BETWEEN :minSize AND :maxSize")
    List<Attachment> findByFileSizeBetween(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);
    
    /**
     * Count attachments by task ID
     */
    long countByTaskId(Long taskId);
    
    /**
     * Find attachments by task ID with pagination
     */
    @Query("SELECT a FROM Attachment a WHERE a.task.id = :taskId ORDER BY a.createdAt DESC")
    List<Attachment> findAttachmentsByTaskId(@Param("taskId") Long taskId);
} 