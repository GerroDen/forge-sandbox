import { FullValidationProcessor, ResourcesValidator } from "@forge/manifest";

/**
 * Mimics `@forge/manifest/out/processor/FullValidationProcessor` without resource validation.
 */
export class CustomValidationProcessor extends FullValidationProcessor {
  constructor() {
    super();
    if (Array.isArray(this.validators)) {
      this.validators = this.validators.filter((validator) => !(validator instanceof ResourcesValidator));
    }
  }
}
