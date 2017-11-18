import { parseXML, prepareJson } from './_jsonXml';

class Parser {
  static parseXmlTeachers(data) {
    this.isParsing = true;
    const teachersJson = parseXML(data);
    this.isParsing = false;
    return teachersJson;
  }

  static prepareJsonTeachers(data) {
    this.isParsing = true;
    const teachersXml = prepareJson(data);
    this.isParsing = false;
    return teachersXml;
  }
}

export default Parser;
