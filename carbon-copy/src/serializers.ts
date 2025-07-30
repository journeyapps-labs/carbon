import {
  JoinAtom,
  JoinAtomFactory,
  JoinAtomType,
  OutputAtomFactory,
  ParamAtom,
  ParamAtomFactory,
  SetVariableAtomFactory,
  GetVariableAtom,
  GetVariableAtomFactory,
  TextAnnotationElementFactory,
  TextAnnotationElement
} from '@journeyapps-labs/carbon-core';
import { generateSerializers } from './helpers';
import * as _ from 'lodash';
import { XmlAtomSerializer, XmlElementSerializer } from './xml/CarbonXMLSerializer';
import { JsonElementSerializer } from './json/CarbonJsonSerializer';
import { XMLElement, XMLDocument } from '@journeyapps/domparser';

export const generateParamAtomSerializers = (type: string) => {
  return generateSerializers<{ param: string; name: string }, ParamAtom>(
    type,
    (atom) => {
      return {
        param: atom.paramType,
        name: atom.paramName
      };
    },
    (atom, data) => {
      atom.paramType = data.param;
      atom.paramName = data.name;
    }
  );
};

export const generateJoinAtomSerializers = () => {
  return generateSerializers<{ join: JoinAtomType }, JoinAtom>(
    JoinAtomFactory.TYPE,
    (atom) => {
      return {
        join: atom.joinType
      };
    },
    (atom, data) => {
      atom.joinType = data.join;
    }
  );
};

export const generateGetVariableAtomSerializers = () => {
  return generateSerializers<{ variable: string }, GetVariableAtom>(
    GetVariableAtomFactory.TYPE,
    (atom) => {
      return {
        variable: atom.variable
      };
    },
    (atom, data) => {
      atom.variable = data.variable;
    }
  );
};

export const generateTextAnnotationAtomSerializers = (): {
  xml: XmlElementSerializer<TextAnnotationElement>;
  json: JsonElementSerializer<TextAnnotationElement>;
} => {
  return {
    json: {
      type: TextAnnotationElementFactory.TYPE,
      serializeJsonElement(element): object {
        return {
          text: element.text
        };
      },
      deSerializeJsonElement(element, data: any) {
        element.text = data.text || '';
      }
    },
    xml: {
      type: TextAnnotationElementFactory.TYPE,
      serializeXmlElement(node: XMLElement, element, document: XMLDocument): XMLElement {
        node.textContent = element.text;
        return node;
      },
      deSerializeXmlElement(node: XMLElement, element) {
        element.text = node.textContent || '';
      }
    }
  };
};

export const serializerBank: () => { xml: XmlElementSerializer; json: JsonElementSerializer }[] = _.memoize(() => [
  generateParamAtomSerializers(ParamAtomFactory.TYPE),
  generateParamAtomSerializers(OutputAtomFactory.TYPE),
  generateParamAtomSerializers(SetVariableAtomFactory.TYPE),
  generateJoinAtomSerializers(),
  generateGetVariableAtomSerializers(),
  generateTextAnnotationAtomSerializers()
]);

export const generateXMLSerializers: () => XmlAtomSerializer[] = _.memoize(() => {
  return serializerBank().map((s) => s.xml);
});

export const generateJSONSerializers: () => JsonElementSerializer[] = _.memoize(() => {
  return serializerBank().map((s) => s.json);
});
