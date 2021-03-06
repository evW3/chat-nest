import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class SchemaValidate implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new HttpException('The expected request body does not match the received one', HttpStatus.BAD_REQUEST);
        }
        return value;
    }
}