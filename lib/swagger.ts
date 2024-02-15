import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    // api path something might looks like './**/api'
    apiFolder: "app/api/",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
