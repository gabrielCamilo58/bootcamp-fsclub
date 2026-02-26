import "dotenv/config"
import {fastifySwagger} from "@fastify/swagger";
import {fastifySwaggerUi} from "@fastify/swagger-ui";
import Fastify from 'fastify'
import {jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider} from 'fastify-type-provider-zod';
import {z} from "zod";
const app = Fastify({
    logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
await app.register(fastifySwagger,{
    openapi:{
        info:{
            title: "API Documentation API",
            description: "API Documentation API documentation API",
            version: "1.0.0",
        },
        servers:[{
            description: "localhost",
            url: "http://localhost:8081",
        }],
    },
    transform:jsonSchemaTransform,
});
await app.register(fastifySwaggerUi,{
    routePrefix:'/docs',
})
app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
        description: "hello world",
        tags:["Hello world"],
        response: {
            200: z.object({
                message: z.string(),
            }),
        },
    },
    handler: () => {
        return {
            message: "Hello world",
        }
    },
});


try {
    await app.listen({ port: Number(process.env.PORT) ?? 8081 })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}