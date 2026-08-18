package soqe.pensa.api.attachment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${pensa.s3.bucket}")
    private String bucketName;

    public void uploadFile(String key, MultipartFile file) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            log.info("Successfully uploaded file {} to bucket {}", key, bucketName);
        } catch (IOException e) {
            log.error("Failed to read file input stream for {}", key, e);
            throw new RuntimeException("Failed to upload file to S3", e);
        } catch (Exception e) {
            log.error("Failed to upload file {} to S3", key, e);
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    public void deleteFile(String key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("Successfully deleted file {} from bucket {}", key, bucketName);
        } catch (Exception e) {
            log.error("Failed to delete file {} from S3", key, e);
            throw new RuntimeException("Failed to delete file from S3", e);
        }
    }

    public String generatePresignedUrl(String key) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(60)) // URL valid for 60 minutes
                    .getObjectRequest(req -> req.bucket(bucketName).key(key))
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for file {}", key, e);
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }
}
