var lineNumber;
//list of keywords
//does not include OPERATORS or CONSTANTS or fake keywords TO/STEP
var KEYWORDS=["SWITCH","CASE","AS","ENDSWITCH", "IF","THEN","ELSE","ELSEIF","ENDIF", "FUNC","RETURN","ENDFUNC", "FOR","NEXT", "REPEAT","UNTIL", "BREAK","CONTINUE","VAR","PRINT", "WHILE","WEND", "DO","LOOP"];
//CHECK <condition>,"error"
var constants={"#PI":Math.PI,"#VERSION":1.013};
//version system:
//x.000 - major version number
//0.xx0 - minor version number
//0.00x - even less significant

//code->tokens

//input: code (string)
//output: function that returns the next token when called
function tokenize(code){
	var i=-1,c,isAlpha,isDigit,whitespace,prev=0;
	
	function next(){
		i++;
		c=code.charAt(i);
		//woah woah calm down don't worry I'm not some idiot who uses apostrophe strings...
		//These are single CHARACTERS (that is, in a language that has a char type, these should be chars and not strings)
		isAlpha=(c>='A'&&c<='Z'||c>='a'&&c<='z');
		isDigit=(c>='0'&&c<='9');
		if(c==='\n')
			lineNumber++;
	}
	
	function getWord(startSkip,endSkip){
		return code.substring(startSkip!==undefined?whitespace+startSkip:whitespace,endSkip!==undefined?i-endSkip:i);
	}
	
	//function jump(pos){
	//	i=pos-1;
	//	next();
	//}
	
	function pushWord(){
		prev=i;
		
		var upper=getWord().toUpperCase(); //optimize by only getting uppercase if word is 5 chars or less
		var type;
		//bitwise not
		if(upper==="NOT")
			type="unary";
		//word operators
		else if(upper==="AND"||upper==="OR"||upper==="XOR"||upper==="UNTIL")
			type="operator";
		else if(upper==="TO")
			type="TO";
		else if(upper==="STEP")
			type="STEP";
		//true/false
		else if(upper==="TRUE"){
			type="number";
			upper=1;
		}else if(upper==="FALSE"){
			type="number";
			upper=0;
		//other keyword
		}else if(KEYWORDS.indexOf(upper)!==-1)
			type=upper;
		//not a keyword
		else
			type="word";
		return {type:type,word:upper};
	}
	
	
	function push(type,word){
		prev=i;
		return {type:type,word:word!==undefined ? word : getWord()};
	}
	lineNumber=1;
	next();
	return function(){
		//read whitespace
		while(c===' '||c==='\t')
			next();
		//if this is the end, push a special ending token
		if(c==='')
			return push("eof");
		//store the start of the non-whitespace
		whitespace=i;
		//"word" (keywords, functions, variables)
		if(isAlpha||c==='_'){
			next();
			while(isAlpha||isDigit||c==='_')
				next();
			if(c==='$'||c==='#'||c==='@')
				next();
			return pushWord();
		//numbers
		}else if(isDigit){
			do
				next();
			while(isDigit);;;
			var c2=code.charAt(i+1);
			if(c==='.' && c2>='0' && c2<='9'){
				next();
				while(isDigit)
					next();
			}
			return push("number",parseFloat(getWord()));
		}else if(c==='.'){
			next();
			if(isDigit){
				do
					next();
				while(isDigit);;;
				return push("number",parseFloat(getWord()));
			}
			return push("dot");
		}else switch(c){
		//strings
		case '"':
			var stringValue="";
			while(1){
				next();
				if(c===''){
					break;
				}else if(c==='"'){
					next();
					if(c!=='"')
						break;
					else
						stringValue+='"';
				}else
					stringValue+=c;
			}
			return push("string",stringValue);
		//comments
		break;case '\'':
			next();
			while(c && c!=='\n' && c!=='\r')
				next();
			next();
			return push("linebreak","");
		//constants
		break;case '#':
			next();
			if(isAlpha||isDigit||c==='_'){
				next();
				while(isAlpha||isDigit||c==='_')
					next();
				var constName=getWord().toUpperCase();
				var constValue=constants[constName];
				if(constValue!==undefined)
					return push("number",constValue);
				else
					return push("error");
			}
			return push("error");
		//less than, less than or equal, left shift
		break;case '<':
			next();
			if(c==='='||c==='<')
				next();
			return push("operator");
		//greater than, greater than or equal, right shift
		break;case '>':
			next();
			if(c==='='||c==='>')
				next();
			return push("operator");
		//equal, equal more
		break;case '=':
			next();
			if(c==='='){
				next();
				return push("operator");
			}
			return push("=");
		//logical not, not equal
		break;case '!':
			next();
			if(c==='='){
				next();
				return push("operator");
			}
			return push("unary");
		break;case '-':
			next();
			return push("minus");
		break;case '~':
			next();
			return push("xor");
		//add, subtract, multiply, divide, bitwise and, or
		break;case '+':case '*':case '/':case '&':case '|':case '%':case '\\':case '^':
			next();
			return push("operator");
		//other
		break;case '\n':case '\r':
			next();
			return push("linebreak");
		//characters
		break;case '(':case ')':case '[':case ']':case '{':case '}':case ',':case ':':case ';':
			var chr=c;
			next();
			return push(chr);
		//print shortcut
		break;case '?':
			next();
			return push("PRINT");
		//other
		break;default:
			next();
			return push("text");
		}
	};
}