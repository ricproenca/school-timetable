import fastXmlParser from 'fast-xml-parser';

const PARSER_OPTIONS = {
  attrPrefix: '',
  attrNodeName: false,
  textNodeName: false,
  ignoreNonTextNodeAttr: false,
  ignoreTextNodeAttr: false,
  ignoreNameSpace: true,
  ignoreRootElement: false,
  textNodeConversion: false,
  textAttrConversion: false,
  arrayMode: false
};

const parseXML = xmlData => {
  var jsonObj;
  if (fastXmlParser.validate(xmlData) === true) {
    jsonObj = fastXmlParser.parse(xmlData, PARSER_OPTIONS);
  }
  return jsonObj;
};

export { parseXML };
