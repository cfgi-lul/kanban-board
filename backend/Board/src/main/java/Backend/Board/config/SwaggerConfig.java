package Backend.Board.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Kanban Board API")
                        .version("3.0.0")
                        .description("Advanced Kanban Board API with search, analytics, performance optimization, and comprehensive features. This API exposes only DTOs for clean separation between internal models and API contracts.")
                        .contact(new Contact()
                                .name("Kanban Board Team")
                                .email("support@kanbanboard.com")
                                .url("https://kanbanboard.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Development server"),
                        new Server().url("https://api.kanbanboard.com").description("Production server")
                ))
                .tags(List.of(
                        new Tag().name("Authentication").description("User authentication and authorization"),
                        new Tag().name("Boards").description("Board management operations"),
                        new Tag().name("Tasks").description("Task management operations"),
                        new Tag().name("Columns").description("Column management operations"),
                        new Tag().name("Comments").description("Comment management operations"),
                        new Tag().name("Users").description("User management operations"),
                        new Tag().name("Labels").description("Label management operations"),
                        new Tag().name("Attachments").description("File attachment operations"),
                        new Tag().name("Notifications").description("User notification operations"),
                        new Tag().name("Search").description("Advanced search and filtering"),
                        new Tag().name("Analytics").description("Analytics and reporting"),
                        new Tag().name("Performance").description("Performance optimization and caching"),
                        new Tag().name("System").description("System-wide operations and monitoring")
                ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
