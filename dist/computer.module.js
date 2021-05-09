var S=3100,w;(function(d){d[d.TOTAL_MEMORY_SIZE=3100]="TOTAL_MEMORY_SIZE",d[d.WORKING_MEMORY_START=0]="WORKING_MEMORY_START",d[d.WORKING_MEMORY_END=1e3]="WORKING_MEMORY_END",d[d.PROGRAM_MEMORY_START=1e3]="PROGRAM_MEMORY_START",d[d.PROGRAM_MEMORY_END=2e3]="PROGRAM_MEMORY_END",d[d.KEYCODE_0_ADDRESS=2e3]="KEYCODE_0_ADDRESS",d[d.KEYCODE_1_ADDRESS=2001]="KEYCODE_1_ADDRESS",d[d.KEYCODE_2_ADDRESS=2002]="KEYCODE_2_ADDRESS",d[d.MOUSE_X_ADDRESS=2010]="MOUSE_X_ADDRESS",d[d.MOUSE_Y_ADDRESS=2011]="MOUSE_Y_ADDRESS",d[d.MOUSE_PIXEL_ADDRESS=2012]="MOUSE_PIXEL_ADDRESS",d[d.MOUSE_BUTTON_ADDRESS=2013]="MOUSE_BUTTON_ADDRESS",d[d.RANDOM_NUMBER_ADDRESS=2050]="RANDOM_NUMBER_ADDRESS",d[d.CURRENT_TIME_ADDRESS=2051]="CURRENT_TIME_ADDRESS",d[d.VIDEO_MEMORY_START=2100]="VIDEO_MEMORY_START",d[d.VIDEO_MEMORY_END=3e3]="VIDEO_MEMORY_END",d[d.AUDIO_CH1_WAVE_TYPE_ADDRESS=3e3]="AUDIO_CH1_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH1_FREQUENCY_ADDRESS=3001]="AUDIO_CH1_FREQUENCY_ADDRESS",d[d.AUDIO_CH1_VOLUME_ADDRESS=3002]="AUDIO_CH1_VOLUME_ADDRESS",d[d.AUDIO_CH2_WAVE_TYPE_ADDRESS=3003]="AUDIO_CH2_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH2_FREQUENCY_ADDRESS=3004]="AUDIO_CH2_FREQUENCY_ADDRESS",d[d.AUDIO_CH2_VOLUME_ADDRESS=3005]="AUDIO_CH2_VOLUME_ADDRESS",d[d.AUDIO_CH3_WAVE_TYPE_ADDRESS=3006]="AUDIO_CH3_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH3_FREQUENCY_ADDRESS=3007]="AUDIO_CH3_FREQUENCY_ADDRESS",d[d.AUDIO_CH3_VOLUME_ADDRESS=3008]="AUDIO_CH3_VOLUME_ADDRESS"})(w||(w={}));var c=w;var T=class{static set(e,t){if(isNaN(t))throw new Error(`tried to write to an invalid value at ${e}`);if(e<0||e>=S)throw new Error("tried to write to an invalid memory address");this.ram[e]=t}static get(e){if(e<0||e>=S)throw new Error("tried to read from an invalid memory address");return this.ram[e]}};T.ram=[];var r=T;var N=30,Y=30,L=20;function g(n){if(n!=null)return n;throw new Error("unexpected null")}var X={"0":[0,0,0],"1":[255,255,255],"2":[255,0,0],"3":[0,255,0],"4":[0,0,255],"5":[255,255,0],"6":[0,255,255],"7":[255,0,255],"8":[192,192,192],"9":[128,128,128],"10":[128,0,0],"11":[128,128,0],"12":[0,128,0],"13":[128,0,128],"14":[0,128,128],"15":[0,0,128]},I=class{static getColor(e,t){let o=X[e];if(!o)throw new Error(`Invalid color code ${e} at address ${t}`);return o}static init(e){I.canvasCtx=e,this.imageData=e.createImageData(I.SCREEN_WIDTH,I.SCREEN_HEIGHT)}static drawScreen(){let e=g(this.imageData),t=c.VIDEO_MEMORY_END-c.VIDEO_MEMORY_START,o=e.data;for(let i=0;i<t;i++){let a=r.ram[c.VIDEO_MEMORY_START+i],p=this.getColor(a||"0",c.VIDEO_MEMORY_START+i);o[i*4]=p[0],o[i*4+1]=p[1],o[i*4+2]=p[2],o[i*4+3]=255}g(this.canvasCtx).putImageData(e,0,0)}},C=I;C.SCREEN_WIDTH=N,C.SCREEN_HEIGHT=Y,C.SCREEN_PIXEL_SCALE=L;var E=C;var b=class{static init(e){if(!document.body)throw new Error("DOM not ready");document.body.onkeydown=s=>{b.keysPressed.add(s.key)},document.body.onkeyup=s=>{this.keysPressed.delete(s.key)},document.body.onmousedown=()=>{this.mouseDown=!0},document.body.onmouseup=()=>{this.mouseDown=!1};let t=e.getBoundingClientRect().top+window.scrollY,o=e.getBoundingClientRect().left+window.scrollX;e.onmousemove=s=>{this.mouseX=Math.floor((s.pageX-o)/E.SCREEN_PIXEL_SCALE),this.mouseY=Math.floor((s.pageY-t)/E.SCREEN_PIXEL_SCALE)}}static updateInputs(){let e=Array.from(b.keysPressed.values()).reverse();r.ram[c.KEYCODE_0_ADDRESS]=e[0]||0,r.ram[c.KEYCODE_1_ADDRESS]=e[1]||0,r.ram[c.KEYCODE_2_ADDRESS]=e[2]||0,r.ram[c.MOUSE_BUTTON_ADDRESS]=b.mouseDown?1:0,r.ram[c.MOUSE_X_ADDRESS]=b.mouseX,r.ram[c.MOUSE_Y_ADDRESS]=b.mouseY,r.ram[c.MOUSE_PIXEL_ADDRESS]=c.VIDEO_MEMORY_START+Math.floor(this.mouseY)*E.SCREEN_WIDTH+Math.floor(this.mouseX),r.ram[c.RANDOM_NUMBER_ADDRESS]=Math.floor(Math.random()*255),r.ram[c.CURRENT_TIME_ADDRESS]=Date.now()}},_=b;_.keysPressed=new Set,_.mouseDown=!1,_.mouseX=0,_.mouseY=0;var U=_;var f=class{static init(e){this.instructions=e,Object.keys(e).forEach(t=>{let o=e[t].opcode;this.instructionsToOpcodes.set(t,o),this.opcodesToInstructions.set(o,t)})}static step(){U.updateInputs();let e=this.advanceProgramCounter(),t=this.opcodesToInstructions.get(e);if(!t)throw new Error(`Unknown opcode '${e}'`);let o=this.instructions[t].operands.map(()=>this.advanceProgramCounter());this.instructions[t].execute.apply(null,o)}static advanceProgramCounter(){if(this.programCounter<c.PROGRAM_MEMORY_START||this.programCounter>=c.PROGRAM_MEMORY_END)throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);return r.get(this.programCounter++)}static reset(){this.programCounter=c.PROGRAM_MEMORY_START,this.halted=!1,this.running=!1}};f.programCounter=c.PROGRAM_MEMORY_START,f.running=!1,f.halted=!1,f.instructionsToOpcodes=new Map,f.opcodesToInstructions=new Map;var m=f;var W=window.AudioContext||window.webkitAudioContext,x={"0":"square","1":"sawtooth","2":"triangle","3":"sine"},R=class{static addAudioChannel(e,t,o){let s=this.audioCtx.createOscillator(),i=this.audioCtx.createGain();s.connect(i),i.connect(this.audioCtx.destination);let a={gain:0,oscillatorType:x["0"],frequency:440};return i.gain.value=a.gain,s.type=a.oscillatorType,s.frequency.value=a.frequency,s.start(),this.audioChannels.push({state:a,waveTypeAddr:e,freqAddr:t,volAddr:o,gainNode:i,oscillatorNode:s})}static updateAudio(){this.audioChannels.forEach(e=>{let t=(r.ram[e.freqAddr]||0)/1e3,o=m.running?(r.ram[e.volAddr]||0)/100*this.MAX_GAIN:0,s=x[r.ram[e.waveTypeAddr]]||x["0"],{state:i}=e;i.gain!==o&&(e.gainNode.gain.setValueAtTime(o,this.audioCtx.currentTime),i.gain=o),i.oscillatorType!==s&&(e.oscillatorNode.type=s,i.oscillatorType=s),i.frequency!==t&&(e.oscillatorNode.frequency.setValueAtTime(t,this.audioCtx.currentTime),i.frequency=t)})}static init(){this.addAudioChannel(c.AUDIO_CH1_WAVE_TYPE_ADDRESS,c.AUDIO_CH1_FREQUENCY_ADDRESS,c.AUDIO_CH1_VOLUME_ADDRESS),this.addAudioChannel(c.AUDIO_CH2_WAVE_TYPE_ADDRESS,c.AUDIO_CH2_FREQUENCY_ADDRESS,c.AUDIO_CH2_VOLUME_ADDRESS),this.addAudioChannel(c.AUDIO_CH3_WAVE_TYPE_ADDRESS,c.AUDIO_CH3_FREQUENCY_ADDRESS,c.AUDIO_CH3_VOLUME_ADDRESS)}};R.MAX_GAIN=.15,R.audioChannels=[],R.audioCtx=new W;var y=R;var M=class{static initInstructionsLabelOperands(){Object.keys(this.instructions).forEach(e=>{let t=this.instructions[e].operands.findIndex(o=>o[1]==="label");t>-1&&this.instructionsLabelOperands.set(e,t)})}static parseProgramText(e){let t=[],o=e.split(`
`),s="",i=0;try{for(i=0;i<o.length;i++){s=o[i];let a={name:"",operands:[]},p=s.replace(/;.*$/,"").split(" ");for(let l of p)if(!(l==null||l==""))if(a.name){if(a.name==="define"&&a.operands.length===0||this.instructionsLabelOperands.get(a.name)===a.operands.length){a.operands.push(l);continue}let u=parseInt(l,10);Number.isNaN(u)?a.operands.push(l):a.operands.push(u)}else{if(l.endsWith(":")){a.name="label",a.operands.push(l.slice(0,l.length-1));break}a.name=l}if(a.name&&a.name!=="label"&&a.name!=="data"&&a.name!=="define"){let l=this.instructions[a.name].operands;if(a.operands.length!==l.length){let u=new Error(`Wrong number of operands for instruction ${a.name}
  got ${a.operands.length}, expected ${l.length}
  at line ${i+1}: '${s}'`);throw u.isException=!0,u}}a.name&&t.push(a)}}catch(a){throw a.isException?a:new Error(`Syntax error on program line ${i+1}: '${s}'`)}return t.push({name:"halt",operands:[]}),t}static assembleAndLoadProgram(e){let t={},o=c.PROGRAM_MEMORY_START;for(let a of e)if(a.name==="label"){let p=a.operands[0];t[p]=o}else a.name!=="define"&&(o+=1+a.operands.length);let s={},i=c.PROGRAM_MEMORY_START;for(let a of e){if(a.name==="label")continue;if(a.name==="define"){s[a.operands[0]]=a.operands[1];continue}if(a.name==="data"){for(let u=0;u<a.operands.length;u++)r.ram[i++]=a.operands[u];continue}let p=m.instructionsToOpcodes.get(a.name);if(!p)throw new Error(`No opcode found for instruction '${a.name}'`);r.ram[i++]=p;let l=a.operands.slice(0);if(this.instructionsLabelOperands.has(a.name)){let u=this.instructionsLabelOperands.get(a.name);if(typeof u!="number")throw new Error("expected number");let h=a.operands[u],O=t[h];if(!O)throw new Error(`unknown label '${h}'`);l[u]=O}for(let u=0;u<l.length;u++){let h=null;if(typeof l[u]=="string")if(l[u]in s)h=s[l[u]];else throw new Error(`'${l[u]}' not defined`);else h=l[u];r.ram[i++]=h}}}static init(e){M.instructions=e,this.initInstructionsLabelOperands()}},A=M;A.instructionsLabelOperands=new Map,A.instructions={};var v=A;var B={name:"data",opcode:9200,description:`operands given will be included in the program when it is
  compiled at the position that they appear in the code, so you can use a label to
  get the address of the data and access it`,operands:[],execute:()=>{}},F={name:"break",opcode:9998,description:"pause program execution, so it must be resumed via simulator UI",operands:[],execute:()=>{m.running=!1}},K={name:"halt",opcode:9999,description:"end program execution, requiring the simulator to be reset to start again",operands:[],execute:()=>{m.running=!1,m.halted=!0}},j={data:B,break:F,halt:K},H=j;var Q={name:"copy_to_from",opcode:9e3,description:"set value at address to the value at the given address",operands:[["destination","address"],["source","address"]],execute:(n,e)=>{let t=r.get(e);r.set(n,t)}},z={name:"copy_to_from_constant",opcode:9001,description:"set value at address to the given constant value",operands:[["destination","address"],["source","constant"]],execute:(n,e)=>{r.set(n,e)}},Z={name:"copy_to_from_ptr",opcode:9002,description:`set value at destination address to the value at the
  address pointed to by the value at 'source' address`,operands:[["destination","address"],["source","pointer"]],execute:(n,e)=>{let t=r.get(e),o=r.get(t);r.set(n,o)}},J={name:"copy_into_ptr_from",opcode:9003,description:`set value at the address pointed to by the value at
  'destination' address to the value at the source address`,operands:[["destination","pointer"],["source","address"]],execute:(n,e)=>{let t=r.get(n),o=r.get(e);r.set(t,o)}},ee={name:"copy_address_of_label",opcode:9004,description:`set value at destination address to the address of the label
  given`,operands:[["destination","address"],["source","label"]],execute:(n,e)=>{r.set(n,e)}},te={copy_to_from:Q,copy_to_from_constant:z,copy_to_from_ptr:Z,copy_into_ptr_from:J,copy_address_of_label:ee},$=te;var re={name:"add",opcode:9010,description:`add the value at the 'a' address with the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e),i=o+s;r.set(t,i)}},ne={name:"add_constant",opcode:9011,description:`add the value at the 'a' address with the constant value 'b' and store
  the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let s=r.get(n)+e;r.set(t,s)}},oe={name:"subtract",opcode:9020,description:`from the value at the 'a' address, subtract the value at the
  'b' address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e),i=o-s;r.set(t,i)}},se={name:"subtract_constant",opcode:9021,description:`from the value at the 'a' address, subtract the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let s=r.get(n)-e;r.set(t,s)}},ae={name:"multiply",opcode:9030,description:`multiply the value at the 'a' address and the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e),i=o*s;r.set(t,i)}},de={name:"multiply_constant",opcode:9031,description:`multiply the value at the 'a' address and the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let s=r.get(n)*e;r.set(t,s)}},ie={name:"divide",opcode:9040,description:`integer divide the value at the 'a' address by the value at
  the 'b' address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e);if(s===0)throw new Error("tried to divide by zero");let i=Math.floor(o/s);r.set(t,i)}},ce={name:"divide_constant",opcode:9041,description:`integer divide the value at the 'a' address by the constant value 'b'
  and store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n);if(e===0)throw new Error("tried to divide by zero");let s=Math.floor(o/e);r.set(t,s)}},ue={name:"modulo",opcode:9050,description:`get the value at the 'a' address modulo the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e);if(s===0)throw new Error("tried to modulo by zero");let i=o%s;r.set(t,i)}},me={name:"modulo_constant",opcode:9051,description:`get the value at the 'a' address modulo the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let s=r.get(n)%e;if(e===0)throw new Error("tried to modulo by zero");r.set(t,s)}},le={add:re,add_constant:ne,subtract:oe,subtract_constant:se,multiply:ae,multiply_constant:de,divide:ie,divide_constant:ce,modulo:ue,modulo_constant:me},V=le;var pe={name:"compare",opcode:9090,description:`compare the value at the 'a' address and the value at the 'b'
  address and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e),i=0;o<s?i=-1:o>s&&(i=1),r.set(t,i)}},he={name:"compare_constant",opcode:9091,description:`compare the value at the 'a' address and the constant value
  'b' and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(n,e,t)=>{let o=r.get(n),s=0;o<e?s=-1:o>e&&(s=1),r.set(t,s)}},fe={compare:pe,compare_constant:he},q=fe;var Ee={name:"jump_to",opcode:9100,description:`set the program counter to the address of the label specified,
  so the program continues from there`,operands:[["destination","label"]],execute:n=>{m.programCounter=n}},_e={name:"branch_if_equal",opcode:9101,description:`if the value at address 'a' is equal to the value at address
  'b', set the program counter to the address of the label specified, so the
  program continues from there`,operands:[["a","address"],["b","address"],["destination","label"]],execute(n,e,t){let o=r.get(n),s=r.get(e);o===s&&(m.programCounter=t)}},be={name:"branch_if_not_equal",opcode:9103,description:`if the value at address 'a' is not equal to the value at
  address 'b', set the program counter to the address of the label specified, so
  the program continues from there`,operands:[["a","address"],["b","address"],["destination","label"]],execute:(n,e,t)=>{let o=r.get(n),s=r.get(e);o!==s&&(m.programCounter=t)}},ge={name:"branch_if_equal_constant",opcode:9102,description:`if the value at address 'a' is equal to the constant value 'b', set the
  program counter to the address of the label specified, so the program continues
  from there`,operands:[["a","address"],["b","constant"],["destination","label"]],execute:(n,e,t)=>{r.get(n)===e&&(m.programCounter=t)}},Ce={name:"branch_if_not_equal_constant",opcode:9104,description:`if the value at address 'a' is not equal to the constant value 'b', set
  the program counter to the address of the label specified, so the program
  continues from there`,operands:[["a","address"],["b","constant"],["destination","label"]],execute:(n,e,t)=>{r.get(n)!==e&&(m.programCounter=t)}},Re={jump_to:Ee,branch_if_equal:_e,branch_if_equal_constant:ge,branch_if_not_equal:be,branch_if_not_equal_constant:Ce},k=Re;var De={...$,...V,...q,...k,...H},P=De;var D={$(n){let e=document.querySelector(n);if(e==null)throw new Error(`couldn't find selector '${n}'`);return e},$Input(n){let e=D.$(n);if(e instanceof HTMLInputElement)return e;throw new Error("expected HTMLInputElement")},$TextArea(n){let e=D.$(n);if(e instanceof HTMLTextAreaElement)return e;throw new Error("expected HTMLTextAreaElement")},$Button(n){let e=D.$(n);if(e instanceof HTMLButtonElement)return e;throw new Error("expected HTMLButtonElement")},$Canvas(n){let e=D.$(n);if(e instanceof HTMLCanvasElement)return e;throw new Error("expected HTMLCanvasElement")},$Select(n){let e=D.$(n);if(e instanceof HTMLSelectElement)return e;throw new Error("expected HTMLSelectElement")},virtualizedScrollView(n,e,t,o,s){Object.assign(n.style,{height:`${e}px`,overflow:"auto"});let i=document.createElement("div");Object.assign(i.style,{height:`${t*o}px`,overflow:"hidden"}),n.appendChild(i);let a=document.createElement("div");i.appendChild(a);let p=10,l=()=>requestAnimationFrame(()=>{let u=Math.max(0,Math.floor(n.scrollTop/t)-p),h=Math.min(o,Math.ceil((n.scrollTop+e)/t)+p),O=u*t;a.style.transform=`translateY(${O}px)`,a.innerHTML=s(u,h)});return n.onscroll=l,l}},G=D;function Se(){let n=g(G.$Canvas("#canvas"));return m.init(P),E.init(n.getContext("2d")),U.init(n),y.init(),v.init(P),{resetMemory:()=>{for(let e=0;e<S;e++)r.ram[e]=0},getMemory:e=>r.ram[e],isRunning:()=>m.running,isHalted:()=>m.halted,getProgramCounter:()=>m.programCounter,resetCPU:()=>m.reset(),setRunning:e=>m.running=e,step:()=>m.step(),getOpcodesToInstructions:()=>m.opcodesToInstructions,getInstructions:()=>m.instructions,updateAudio:()=>y.updateAudio(),drawScreen:()=>E.drawScreen(),parseProgramText:e=>v.parseProgramText(e),assembleAndLoadProgram:e=>v.assembleAndLoadProgram(e)}}export{Se as default};
