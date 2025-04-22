import { JsonObject, JsonValue } from '@/types/types';

/**
 * XML을 JSON으로 변환하는 유틸리티
 * 관심사 분리와 단일 책임 원칙에 맞게 구성됨
 */
export class XmlConverter {
  /**
   * XML 텍스트를 JSON으로 변환
   * @param xmlText XML 문자열
   * @param options 추가 옵션
   * @returns 변환된 JSON 객체
   */
  static parse(
    xmlText: string,
    options: { processApiResponse?: boolean } = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // 1. XML 문자열을 DOM으로 파싱
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');

        // 파싱 오류 확인
        const parseError = xml.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
          throw new Error('XML 파싱 오류: ' + parseError[0].textContent);
        }

        // 2. DOM을 JSON으로 변환
        const rootElement = xml.documentElement;
        if (!rootElement) {
          throw new Error('XML 루트 요소를 찾을 수 없습니다.');
        }

        const json = this.nodeToJson(rootElement);

        // 3. 공공 API 응답 처리 (선택적)
        if (options.processApiResponse) {
          resolve(this.processApiResponse(json));
        } else {
          resolve(json);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * XML 노드를 JSON 객체로 변환하는 내부 메서드
   * @param node XML 노드
   * @returns JSON 객체 또는 문자열
   */
  private static nodeToJson(node: Node): JsonObject | string {
    // 텍스트 노드인 경우 텍스트 내용 반환
    if (node.nodeType === 3) {
      // TEXT_NODE
      const nodeValue = node.nodeValue?.trim();
      return nodeValue || '';
    }

    // 노드가 Element 타입이 아니면 빈 문자열 반환
    if (node.nodeType !== 1) {
      // ELEMENT_NODE
      return '';
    }

    const element = node as Element;
    const result: JsonObject = {};

    // 속성 처리
    if (element.hasAttributes()) {
      const attributes: JsonObject = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes.item(i);
        if (attr) {
          attributes[attr.nodeName] = attr.nodeValue || '';
        }
      }
      if (Object.keys(attributes).length > 0) {
        result['@attributes'] = attributes;
      }
    }

    // 자식 노드 처리
    let hasTextContent = false;
    let textContent = '';

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];

      if (child.nodeType === 3) {
        // 텍스트 노드
        const content = child.nodeValue?.trim();
        if (content) {
          hasTextContent = true;
          textContent += content;
        }
      } else if (child.nodeType === 1) {
        // 요소 노드
        const childElement = child as Element;
        const childName = childElement.nodeName;
        const childValue = this.nodeToJson(childElement);

        // 같은 이름의 노드가 여러 개일 경우 배열로 처리
        if (result[childName] !== undefined) {
          if (!Array.isArray(result[childName])) {
            result[childName] = [result[childName] as JsonValue];
          }
          (result[childName] as JsonValue[]).push(childValue);
        } else {
          result[childName] = childValue;
        }
      }
    }

    // 텍스트 내용만 있는 경우 또는 텍스트와 자식 노드가 함께 있는 경우
    if (hasTextContent) {
      if (
        Object.keys(result).length === 0 ||
        (Object.keys(result).length === 1 && result['@attributes'])
      ) {
        if (result['@attributes']) {
          result['#text'] = textContent;
        } else {
          return textContent;
        }
      } else {
        result['#text'] = textContent;
      }
    }

    return result;
  }

  /**
   * 공공 API 응답 JSON을 처리하는 내부 메서드
   * @param json 변환된 JSON 객체
   * @returns 처리된 API 응답 객체
   */
  private static processApiResponse(json: any): any {
    if (!json || typeof json !== 'object' || !('response' in json)) {
      return json;
    }

    const response = json.response;

    // 오류 응답 확인
    if (response.header && response.header.resultCode !== '00') {
      throw new Error(
        `API 오류: ${response.header.resultMsg || '알 수 없는 오류'}`
      );
    }

    // 빈 응답 확인
    if (!response.body || !response.body.items) {
      return null;
    }

    let items = response.body.items.item;

    // 단일 항목을 배열로 변환
    if (items && !Array.isArray(items)) {
      items = [items];
    } else if (!items) {
      items = [];
    }

    return {
      items,
      totalCount: parseInt(response.body.totalCount || '0', 10),
      pageNo: parseInt(response.body.pageNo || '1', 10),
      numOfRows: parseInt(response.body.numOfRows || '10', 10),
    };
  }
}

/**
 * XML 텍스트를 JSON으로 변환 (기존 함수와의 호환성 유지)
 */
export const parseXmlTextToJson = async (xmlText: string): Promise<any> => {
  return XmlConverter.parse(xmlText);
};

/**
 * 공공 API 응답 XML을 처리 (기존 함수와의 호환성 유지)
 */
export const processXmlResponse = async (xmlText: string): Promise<any> => {
  return XmlConverter.parse(xmlText, { processApiResponse: true });
};

// 기존 함수 호환성 유지 (Deprecated)
export const xmlToJson = (xml: Node): JsonObject | string => {
  console.warn(
    'xmlToJson 함수는 곧 지원 중단됩니다. XmlConverter.parse를 사용하세요.'
  );
  // private 메서드 직접 접근 대신 새로운 인스턴스 생성 방식으로 변경
  if (xml.nodeType === 3) {
    const nodeValue = xml.nodeValue?.trim();
    return nodeValue || '';
  }

  if (xml.nodeType !== 1) {
    return '';
  }

  // parseXmlTextToJson으로 처리할 수 없는 직접 노드 변환이므로
  // 기존 로직 간소화하여 구현
  const element = xml as Element;
  const result: JsonObject = {};

  // 최소한의 변환만 수행
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child.nodeType === 1) {
      const childElement = child as Element;
      result[childElement.nodeName] = xmlToJson(childElement);
    }
  }

  return result;
};
