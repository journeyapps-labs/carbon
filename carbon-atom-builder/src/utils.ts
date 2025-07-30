import { XMLElement } from '@journeyapps/domparser';

export const getAttribute = (element: XMLElement, name: string, cb: (v: string) => any) => {
  if (!element.hasAttribute(name)) {
    return;
  }
  const value = element.getAttribute(name)?.trim();
  if (value === '') {
    return;
  }
  cb(value);
};

export const getBooleanAttribute = (element: XMLElement, name: string, cb: (v: boolean) => any) => {
  getAttribute(element, name, (value) => {
    if (value.toLowerCase() === 'true') {
      cb(true);
    } else if (value.toLowerCase() === 'false') {
      cb(false);
    } else {
      cb(null);
    }
  });
};

export const getNodes = (element: XMLElement, tag: string): XMLElement[] => {
  return Array.from(element.childNodes).filter((f) => f.nodeName === tag) as XMLElement[];
};
