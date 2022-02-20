var R=Object.defineProperty;var T=(u,e)=>{for(var t in e)R(u,t,{get:e[t],enumerable:!0})};var f={};T(f,{DefaultTokenDefinitions:()=>N,TokenDefinition:()=>l,TokenMatch:()=>A,TokenNames:()=>o,default:()=>p});var o=Object.freeze({BLOCK_CLOSE:"blockOpen",BLOCK_OPEN:"blockOpen",DATA_BOOLEAN:"dataBoolean",DATA_NAME:"dataName",DATA_NUMBER:"dataNumber",DATA_REFERENCE:"dataReference",DATA_STRING:"dataString",INSTRUCTION_END:"instructionEnd",PARATHESIS_CLOSE:"parathesisClose",PARATHESIS_OPEN:"parathesisOpen",SEPARATOR_LIST:"separatorList"}),l=class{constructor(e,t){this.name=e,this._pattern=new RegExp(t)}match(e){return e.match(this._pattern)}},N=[new l(o.SEPARATOR_LIST,"^,"),new l(o.INSTRUCTION_END,"^;"),new l(o.PARATHESIS_OPEN,"^\\("),new l(o.PARATHESIS_CLOSE,"^\\)"),new l(o.BLOCK_OPEN,"^\\{"),new l(o.BLOCK_CLOSE,"^\\}"),new l(o.DATA_BOOLEAN,"^(true|false)"),new l(o.DATA_NUMBER,"^(\\d+)(\\.\\d+)?"),new l(o.DATA_STRING,'^"([^"])+"'),new l(o.DATA_REFERENCE,"^\\w+")],A=class{constructor(e,t,n){this.name=e,this.value=t,this.position=n}},p=class{tokenize(e){let t=[],n=0,i=c=>{n+=c;let s=e.substring(0,c);return e=e.slice(c),s};for(;e&&e!=="";){if(e.match(/^(\s|\n)/)){i(1);continue}let c=null;for(let s of N){let a=s.match(e);if(a){c=new A(s.name,a[0],n),i(a[0].length);break}}if(!c)throw console.error(e),new Error("invalid input");t.push(c)}return t}};var C={};T(C,{ASTNode:()=>h,ASTNodeNames:()=>r,default:()=>_});var h=class{constructor(e,t,n,i){this.name=e,this.value=t,this.range={start:n,end:i}}},r=Object.freeze({DATA_BOOLEAN:"dataBoolean",DATA_NUMBER:"dataNumber",DATA_REFERENCE:"dataReference",DATA_STRING:"dataString",FUNCTION_BLOCK:"functionBlock",FUNCTION_CALL:"functionCall"}),_=class{constructor(){this.reset()}reset(){this._tokens=null,this._position=0}peekCheck(e){return this._position+1<this._tokens.length?this._tokens[this._position+1].name===e:!1}consumeToken(){return this._position++,this._tokens[this._position]}throwTokenError(e){let t=this.consumeToken();throw new Error(`expected ${e} at position ${t.position}. Got '${t.value}'.`)}parse(e){this.reset(),this._tokens=[null].concat(e);let t=[];for(;this._position<this._tokens.length-1;)if(this.peekCheck(o.DATA_REFERENCE)){let n=this.consumeToken();if(this.peekCheck(o.PARATHESIS_OPEN)){this.consumeToken();let i=this.parseFunctionCall(n);t.push(i);continue}else this.throwTokenError("valid function call start")}else this.throwTokenError("function call");return t}parseFunctionCall(e){let t=e.value,n=[];if(this.peekCheck(o.PARATHESIS_CLOSE))return this.consumeToken(),new h(r.FUNCTION_CALL,{name:t,parameters:n});let i=!0,c=null;for(;this._position<this._tokens.length;)if(this.peekCheck(o.DATA_BOOLEAN)&&i){let s=this.consumeToken(),a=new h(r.DATA_NUMBER,s.value==="true",s.position,s.position+s.value.length);n.push(a),i=!1;continue}else if(this.peekCheck(o.DATA_NUMBER)&&i){let s=this.consumeToken(),a=new h(r.DATA_NUMBER,parseFloat(s.value),s.position,s.position+s.value.length);n.push(a),i=!1;continue}else if(this.peekCheck(o.DATA_REFERENCE)&&i){let s=this.consumeToken();if(this.peekCheck(o.PARATHESIS_OPEN)){this.consumeToken();let a=this.parseFunctionCall(s);n.push(a)}else{let a=new h(r.DATA_REFERENCE,s.value,s.position,s.position+s.value.length);n.push(a)}i=!1;continue}else if(this.peekCheck(o.DATA_STRING)&&i){let s=this.consumeToken(),a=new h(r.DATA_STRING,s.value.slice(1,-1),s.position,s.position+s.value.length);n.push(a),i=!1;continue}else if(this.peekCheck(o.SEPARATOR_LIST)&&!i){this.consumeToken(),i=!0;continue}else if(this.peekCheck(o.PARATHESIS_CLOSE)&&!i){c=this.consumeToken();break}else this.throwTokenError(i?"function parameter":"function closing or list separator");if(this.peekCheck(o.INSTRUCTION_END)){let s=this.consumeToken();return new h(r.FUNCTION_CALL,{name:t,parameters:n},e.position,s.position+1)}if(this.peekCheck(o.BLOCK_OPEN)){let s=this.consumeToken(),a=this.parseFunctionBlock(s);return new h(r.FUNCTION_CALL,{name:t,parameters:n,block:a},e.position,a.range.end)}return new h(r.FUNCTION_CALL,{name:t,parameters:n},e.position,c.position+1)}parseFunctionBlock(e){let t=[];for(;this._position<this._tokens.length;)if(this.peekCheck(o.DATA_REFERENCE)){let n=this.consumeToken();if(this.peekCheck(o.PARATHESIS_OPEN)){this.consumeToken();let i=this.parseFunctionCall(n);t.push(i);continue}else this.throwTokenError("valid function call start")}else if(this.peekCheck(o.BLOCK_CLOSE)){let n=this.consumeToken();return new h(r.FUNCTION_BLOCK,t,e.position,n.position+1)}else this.throwTokenError("function block closing or function call");throw new Error("No tokens left. Invalid function block.")}};var m={};T(m,{RunnerPosition:()=>E,default:()=>k});var E=class{constructor(){this._path=[0],this._returnStack=[()=>{throw new Error("Too many returns!")}]}inc(){this._path[this._path.length-1]++}restart(){this._path[this._path.length-1]=0}deeper(){this._path.push(-1)}higher(){this._path.pop()}pushReturn(e){this._returnStack.push(e)}popReturn(){return this._returnStack.pop()}},k=class{constructor(){this._calls={},this.reset()}reset(){this._position=new E,this._ast=null,this._context={},this._lastNode=null,this.isDone=!1}loadAst(e){this.reset(),this._ast=e}registerCall(e,t){this._calls[e]=t.bind(this)}deregisterCall(e){delete this._calls[e]}currentNode(){let e=this._ast;for(let t of this._position._path)if(e.value&&e.value.block)if(e.value.block.value[t]){e=e.value.block.value[t];continue}else{let n=this._position.popReturn();return n()?(this._position.higher(),this._position.inc()):(this._position.restart(),this._position.pushReturn(n)),this.currentNode()}else if(e[t])e=e[t];else return;return e}step(){let e=this.currentNode();if(!e)return this.isDone=!0,this.isDone;if(this._lastNode=e,e.name===r.FUNCTION_CALL)this.resolveFunctionCall(e);else throw new Error("no function call given for next step");return this._position.inc(),this.isDone}resolveFunctionCall(e){if(this._calls[e.value.name])return this._calls[e.value.name](...e.value.parameters);throw new Error(`unknown function call to '${e.value.name}'`)}resolveParameterValue(e){if(e.name===r.DATA_BOOLEAN)return e.value;if(e.name===r.DATA_NUMBER)return e.value;if(e.name===r.DATA_REFERENCE)return this._context[e.value];if(e.name===r.DATA_STRING)return e.value;if(e.name===r.FUNCTION_CALL)return this.resolveFunctionCall(e);throw new Error(`unknown parameter ASTNode name '${e.name}'`)}resolveParametersValues(e){let t=[];for(let n of e)t.push(this.resolveParameterValue(n));return t}};var d=class{constructor(){this.reset()}reset(){this.tokens=[],this.ast=null,this._tokenizer=new p,this._parser=new _,this._runner=new k,this._program=null}loadProgram(e){this._program=e,this.tokenize(),this.parse()}tokenize(){this.tokens=this._tokenizer.tokenize(this._program)}parse(){this.ast=this._parser.parse(this.tokens),this._runner.loadAst(this.ast)}step(){this._runner.step()}registerCall(e,t){this._runner.registerCall(e,t)}deregisterCall(e){this._runner.deregisterCall(e)}};export{C as WatasuParser,m as WatasuRunner,f as WatasuTokenizer,d as default};
