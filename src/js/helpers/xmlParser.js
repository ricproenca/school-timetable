import { parseXML } from './_jsonXml';

const ATTRKEY = '$';

class Parser {
  static parseXmlTeachers(data) {
    this.isParsing = true;
    const teachersJson = parseXML(data, ATTRKEY);
    this.isParsing = false;
    return teachersJson;
  }
}

export default Parser;
