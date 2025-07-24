import { AnnotationElement } from './AnnotationElement';
import { ElementFactory, GenerateElementEvent } from '../../core/basic/ElementFactory';

export class TextAnnotationElement extends AnnotationElement {
  text: string;

  constructor() {
    super(TextAnnotationElementFactory.TYPE);
    this.text = 'Hello World';
  }
}

export class TextAnnotationElementFactory extends ElementFactory<TextAnnotationElement> {
  static TYPE = 'text-annotation';

  constructor() {
    super({
      category: 'Annotation',
      description: 'Text descriptions',
      label: 'Text',
      type: TextAnnotationElementFactory.TYPE
    });
  }

  _generateElement(event: GenerateElementEvent | undefined): TextAnnotationElement {
    return new TextAnnotationElement();
  }
}
