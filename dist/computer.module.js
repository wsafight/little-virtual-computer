var S=(d=>(d[d.TOTAL_MEMORY_SIZE=3100]="TOTAL_MEMORY_SIZE",d[d.WORKING_MEMORY_START=0]="WORKING_MEMORY_START",d[d.WORKING_MEMORY_END=1e3]="WORKING_MEMORY_END",d[d.PROGRAM_MEMORY_START=1e3]="PROGRAM_MEMORY_START",d[d.PROGRAM_MEMORY_END=2e3]="PROGRAM_MEMORY_END",d[d.KEYCODE_0_ADDRESS=2e3]="KEYCODE_0_ADDRESS",d[d.KEYCODE_1_ADDRESS=2001]="KEYCODE_1_ADDRESS",d[d.KEYCODE_2_ADDRESS=2002]="KEYCODE_2_ADDRESS",d[d.MOUSE_X_ADDRESS=2010]="MOUSE_X_ADDRESS",d[d.MOUSE_Y_ADDRESS=2011]="MOUSE_Y_ADDRESS",d[d.MOUSE_PIXEL_ADDRESS=2012]="MOUSE_PIXEL_ADDRESS",d[d.MOUSE_BUTTON_ADDRESS=2013]="MOUSE_BUTTON_ADDRESS",d[d.RANDOM_NUMBER_ADDRESS=2050]="RANDOM_NUMBER_ADDRESS",d[d.CURRENT_TIME_ADDRESS=2051]="CURRENT_TIME_ADDRESS",d[d.VIDEO_MEMORY_START=2100]="VIDEO_MEMORY_START",d[d.VIDEO_MEMORY_END=3e3]="VIDEO_MEMORY_END",d[d.AUDIO_CH1_WAVE_TYPE_ADDRESS=3e3]="AUDIO_CH1_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH1_FREQUENCY_ADDRESS=3001]="AUDIO_CH1_FREQUENCY_ADDRESS",d[d.AUDIO_CH1_VOLUME_ADDRESS=3002]="AUDIO_CH1_VOLUME_ADDRESS",d[d.AUDIO_CH2_WAVE_TYPE_ADDRESS=3003]="AUDIO_CH2_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH2_FREQUENCY_ADDRESS=3004]="AUDIO_CH2_FREQUENCY_ADDRESS",d[d.AUDIO_CH2_VOLUME_ADDRESS=3005]="AUDIO_CH2_VOLUME_ADDRESS",d[d.AUDIO_CH3_WAVE_TYPE_ADDRESS=3006]="AUDIO_CH3_WAVE_TYPE_ADDRESS",d[d.AUDIO_CH3_FREQUENCY_ADDRESS=3007]="AUDIO_CH3_FREQUENCY_ADDRESS",d[d.AUDIO_CH3_VOLUME_ADDRESS=3008]="AUDIO_CH3_VOLUME_ADDRESS",d))(S||{}),c=S;var r=class{static ram=[];static set(e,s){if(isNaN(s))throw new Error(`tried to write to an invalid value at ${e}`);if(e<0||e>=3100)throw new Error("tried to write to an invalid memory address");this.ram[e]=s}static get(e){if(e<0||e>=3100)throw new Error("tried to read from an invalid memory address");return this.ram[e]}};function b(t){if(t!=null)return t;throw new Error("unexpected null")}var N={0:[0,0,0],1:[255,255,255],2:[255,0,0],3:[0,255,0],4:[0,0,255],5:[255,255,0],6:[0,255,255],7:[255,0,255],8:[192,192,192],9:[128,128,128],10:[128,0,0],11:[128,128,0],12:[0,128,0],13:[128,0,128],14:[0,128,128],15:[0,0,128]},h=class t{static SCREEN_WIDTH=30;static SCREEN_HEIGHT=30;static SCREEN_PIXEL_SCALE=20;static imageData;static canvasCtx;static getColor(e,s){let n=N[e];if(!n)throw new Error(`Invalid color code ${e} at address ${s}`);return n}static init(e){t.canvasCtx=e,this.imageData=e.createImageData(t.SCREEN_WIDTH,t.SCREEN_HEIGHT)}static drawScreen(){let e=b(this.imageData),s=c.VIDEO_MEMORY_END-c.VIDEO_MEMORY_START,n=e.data;for(let i=0;i<s;i++){let a=r.ram[c.VIDEO_MEMORY_START+i],m=this.getColor(a||"0",c.VIDEO_MEMORY_START+i);n[i*4]=m[0],n[i*4+1]=m[1],n[i*4+2]=m[2],n[i*4+3]=255}b(this.canvasCtx).putImageData(e,0,0)}};var E=class t{static keysPressed=new Set;static mouseDown=!1;static mouseX=0;static mouseY=0;static init(e){if(!document.body)throw new Error("DOM not ready");document.body.onkeydown=o=>{t.keysPressed.add(o.key)},document.body.onkeyup=o=>{this.keysPressed.delete(o.key)},document.body.onmousedown=()=>{this.mouseDown=!0},document.body.onmouseup=()=>{this.mouseDown=!1};let s=e.getBoundingClientRect().top+window.scrollY,n=e.getBoundingClientRect().left+window.scrollX;e.onmousemove=o=>{this.mouseX=Math.floor((o.pageX-n)/h.SCREEN_PIXEL_SCALE),this.mouseY=Math.floor((o.pageY-s)/h.SCREEN_PIXEL_SCALE)}}static updateInputs(){let e=Array.from(t.keysPressed.values()).reverse();r.ram[c.KEYCODE_0_ADDRESS]=e[0]||0,r.ram[c.KEYCODE_1_ADDRESS]=e[1]||0,r.ram[c.KEYCODE_2_ADDRESS]=e[2]||0,r.ram[c.MOUSE_BUTTON_ADDRESS]=t.mouseDown?1:0,r.ram[c.MOUSE_X_ADDRESS]=t.mouseX,r.ram[c.MOUSE_Y_ADDRESS]=t.mouseY,r.ram[c.MOUSE_PIXEL_ADDRESS]=c.VIDEO_MEMORY_START+Math.floor(this.mouseY)*h.SCREEN_WIDTH+Math.floor(this.mouseX),r.ram[c.RANDOM_NUMBER_ADDRESS]=Math.floor(Math.random()*255),r.ram[c.CURRENT_TIME_ADDRESS]=Date.now()}};var u=class{static programCounter=c.PROGRAM_MEMORY_START;static running=!1;static halted=!1;static instructionsToOpcodes=new Map;static opcodesToInstructions=new Map;static instructions;static init(e){this.instructions=e,Object.keys(e).forEach(s=>{let n=e[s].opcode;this.instructionsToOpcodes.set(s,n),this.opcodesToInstructions.set(n,s)})}static step(){E.updateInputs();let e=this.advanceProgramCounter(),s=this.opcodesToInstructions.get(e);if(!s)throw new Error(`Unknown opcode '${e}'`);let n=this.instructions[s].operands.map(()=>this.advanceProgramCounter());this.instructions[s].execute.apply(null,n)}static advanceProgramCounter(){if(this.programCounter<c.PROGRAM_MEMORY_START||this.programCounter>=c.PROGRAM_MEMORY_END)throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);return r.get(this.programCounter++)}static reset(){this.programCounter=c.PROGRAM_MEMORY_START,this.halted=!1,this.running=!1}};var Y=window.AudioContext||window.webkitAudioContext,A={0:"square",1:"sawtooth",2:"triangle",3:"sine"},g=class{static MAX_GAIN=.15;static audioChannels=[];static audioCtx=new Y;static addAudioChannel(e,s,n){let o=this.audioCtx.createOscillator(),i=this.audioCtx.createGain();o.connect(i),i.connect(this.audioCtx.destination);let a={gain:0,oscillatorType:A[0],frequency:440};return i.gain.value=a.gain,o.type=a.oscillatorType,o.frequency.value=a.frequency,o.start(),this.audioChannels.push({state:a,waveTypeAddr:e,freqAddr:s,volAddr:n,gainNode:i,oscillatorNode:o})}static updateAudio(){this.audioChannels.forEach(e=>{let s=(r.ram[e.freqAddr]||0)/1e3,n=u.running?(r.ram[e.volAddr]||0)/100*this.MAX_GAIN:0,o=A[r.ram[e.waveTypeAddr]]||A[0],{state:i}=e;i.gain!==n&&(e.gainNode.gain.setValueAtTime(n,this.audioCtx.currentTime),i.gain=n),i.oscillatorType!==o&&(e.oscillatorNode.type=o,i.oscillatorType=o),i.frequency!==s&&(e.oscillatorNode.frequency.setValueAtTime(s,this.audioCtx.currentTime),i.frequency=s)})}static init(){this.addAudioChannel(c.AUDIO_CH1_WAVE_TYPE_ADDRESS,c.AUDIO_CH1_FREQUENCY_ADDRESS,c.AUDIO_CH1_VOLUME_ADDRESS),this.addAudioChannel(c.AUDIO_CH2_WAVE_TYPE_ADDRESS,c.AUDIO_CH2_FREQUENCY_ADDRESS,c.AUDIO_CH2_VOLUME_ADDRESS),this.addAudioChannel(c.AUDIO_CH3_WAVE_TYPE_ADDRESS,c.AUDIO_CH3_FREQUENCY_ADDRESS,c.AUDIO_CH3_VOLUME_ADDRESS)}};var _=class t{static instructionsLabelOperands=new Map;static instructions={};static initInstructionsLabelOperands(){Object.keys(this.instructions).forEach(e=>{let s=this.instructions[e].operands.findIndex(n=>n[1]==="label");s>-1&&this.instructionsLabelOperands.set(e,s)})}static parseProgramText(e){let s=[],n=e.split(`
`),o="",i=0;try{for(i=0;i<n.length;i++){o=n[i];let a={name:"",operands:[]},m=o.replace(/;.*$/,"").split(" ");for(let p of m)if(!(p==null||p==""))if(a.name){if(a.name==="define"&&a.operands.length===0||this.instructionsLabelOperands.get(a.name)===a.operands.length){a.operands.push(p);continue}let l=parseInt(p,10);Number.isNaN(l)?a.operands.push(p):a.operands.push(l)}else{if(p.endsWith(":")){a.name="label",a.operands.push(p.slice(0,p.length-1));break}a.name=p}if(a.name&&a.name!=="label"&&a.name!=="data"&&a.name!=="define"){let p=this.instructions[a.name].operands;if(a.operands.length!==p.length){let l=new Error(`Wrong number of operands for instruction ${a.name}
  got ${a.operands.length}, expected ${p.length}
  at line ${i+1}: '${o}'`);throw l.isException=!0,l}}a.name&&s.push(a)}}catch(a){throw a.isException?a:new Error(`Syntax error on program line ${i+1}: '${o}'`)}return s.push({name:"halt",operands:[]}),s}static assembleAndLoadProgram(e){let s={},n=c.PROGRAM_MEMORY_START;for(let a of e)if(a.name==="label"){let m=a.operands[0];s[m]=n}else a.name!=="define"&&(n+=1+a.operands.length);let o={},i=c.PROGRAM_MEMORY_START;for(let a of e){if(a.name==="label")continue;if(a.name==="define"){o[a.operands[0]]=a.operands[1];continue}if(a.name==="data"){for(let l=0;l<a.operands.length;l++)r.ram[i++]=a.operands[l];continue}let m=u.instructionsToOpcodes.get(a.name);if(!m)throw new Error(`No opcode found for instruction '${a.name}'`);r.ram[i++]=m;let p=a.operands.slice(0);if(this.instructionsLabelOperands.has(a.name)){let l=this.instructionsLabelOperands.get(a.name);if(typeof l!="number")throw new Error("expected number");let f=a.operands[l],R=s[f];if(!R)throw new Error(`unknown label '${f}'`);p[l]=R}for(let l=0;l<p.length;l++){let f=null;if(typeof p[l]=="string")if(p[l]in o)f=o[p[l]];else throw new Error(`'${p[l]}' not defined`);else f=p[l];r.ram[i++]=f}}}static init(e){t.instructions=e,this.initInstructionsLabelOperands()}};var L={name:"data",opcode:9200,description:`operands given will be included in the program when it is
  compiled at the position that they appear in the code, so you can use a label to
  get the address of the data and access it`,operands:[],execute:()=>{}},H={name:"break",opcode:9998,description:"pause program execution, so it must be resumed via simulator UI",operands:[],execute:()=>{u.running=!1}},$={name:"halt",opcode:9999,description:"end program execution, requiring the simulator to be reset to start again",operands:[],execute:()=>{u.running=!1,u.halted=!0}},V={data:L,break:H,halt:$},O=V;var q={name:"copy_to_from",opcode:9e3,description:"set value at address to the value at the given address",operands:[["destination","address"],["source","address"]],execute:(t,e)=>{let s=r.get(e);r.set(t,s)}},k={name:"copy_to_from_constant",opcode:9001,description:"set value at address to the given constant value",operands:[["destination","address"],["source","constant"]],execute:(t,e)=>{r.set(t,e)}},G={name:"copy_to_from_ptr",opcode:9002,description:`set value at destination address to the value at the
  address pointed to by the value at 'source' address`,operands:[["destination","address"],["source","pointer"]],execute:(t,e)=>{let s=r.get(e),n=r.get(s);r.set(t,n)}},X={name:"copy_into_ptr_from",opcode:9003,description:`set value at the address pointed to by the value at
  'destination' address to the value at the source address`,operands:[["destination","pointer"],["source","address"]],execute:(t,e)=>{let s=r.get(t),n=r.get(e);r.set(s,n)}},W={name:"copy_address_of_label",opcode:9004,description:`set value at destination address to the address of the label
  given`,operands:[["destination","address"],["source","label"]],execute:(t,e)=>{r.set(t,e)}},B={copy_to_from:q,copy_to_from_constant:k,copy_to_from_ptr:G,copy_into_ptr_from:X,copy_address_of_label:W},T=B;var F={name:"add",opcode:9010,description:`add the value at the 'a' address with the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e),i=n+o;r.set(s,i)}},K={name:"add_constant",opcode:9011,description:`add the value at the 'a' address with the constant value 'b' and store
  the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let o=r.get(t)+e;r.set(s,o)}},j={name:"subtract",opcode:9020,description:`from the value at the 'a' address, subtract the value at the
  'b' address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e),i=n-o;r.set(s,i)}},Q={name:"subtract_constant",opcode:9021,description:`from the value at the 'a' address, subtract the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let o=r.get(t)-e;r.set(s,o)}},z={name:"multiply",opcode:9030,description:`multiply the value at the 'a' address and the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e),i=n*o;r.set(s,i)}},Z={name:"multiply_constant",opcode:9031,description:`multiply the value at the 'a' address and the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let o=r.get(t)*e;r.set(s,o)}},J={name:"divide",opcode:9040,description:`integer divide the value at the 'a' address by the value at
  the 'b' address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e);if(o===0)throw new Error("tried to divide by zero");let i=Math.floor(n/o);r.set(s,i)}},ee={name:"divide_constant",opcode:9041,description:`integer divide the value at the 'a' address by the constant value 'b'
  and store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t);if(e===0)throw new Error("tried to divide by zero");let o=Math.floor(n/e);r.set(s,o)}},te={name:"modulo",opcode:9050,description:`get the value at the 'a' address modulo the value at the 'b'
  address and store the result at the 'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e);if(o===0)throw new Error("tried to modulo by zero");let i=n%o;r.set(s,i)}},re={name:"modulo_constant",opcode:9051,description:`get the value at the 'a' address modulo the constant value 'b' and
  store the result at the 'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let o=r.get(t)%e;if(e===0)throw new Error("tried to modulo by zero");r.set(s,o)}},se={add:F,add_constant:K,subtract:j,subtract_constant:Q,multiply:z,multiply_constant:Z,divide:J,divide_constant:ee,modulo:te,modulo_constant:re},U=se;var ne={name:"compare",opcode:9090,description:`compare the value at the 'a' address and the value at the 'b'
  address and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,operands:[["a","address"],["b","address"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e),i=0;n<o?i=-1:n>o&&(i=1),r.set(s,i)}},oe={name:"compare_constant",opcode:9091,description:`compare the value at the 'a' address and the constant value
  'b' and store the result (-1 for a < b, 0 for a == b, 1 for a > b) at the
  'result' address`,operands:[["a","address"],["b","constant"],["result","address"]],execute:(t,e,s)=>{let n=r.get(t),o=0;n<e?o=-1:n>e&&(o=1),r.set(s,o)}},ae={compare:ne,compare_constant:oe},v=ae;var de={name:"jump_to",opcode:9100,description:`set the program counter to the address of the label specified,
  so the program continues from there`,operands:[["destination","label"]],execute:t=>{u.programCounter=t}},ie={name:"branch_if_equal",opcode:9101,description:`if the value at address 'a' is equal to the value at address
  'b', set the program counter to the address of the label specified, so the
  program continues from there`,operands:[["a","address"],["b","address"],["destination","label"]],execute(t,e,s){let n=r.get(t),o=r.get(e);n===o&&(u.programCounter=s)}},ce={name:"branch_if_not_equal",opcode:9103,description:`if the value at address 'a' is not equal to the value at
  address 'b', set the program counter to the address of the label specified, so
  the program continues from there`,operands:[["a","address"],["b","address"],["destination","label"]],execute:(t,e,s)=>{let n=r.get(t),o=r.get(e);n!==o&&(u.programCounter=s)}},ue={name:"branch_if_equal_constant",opcode:9102,description:`if the value at address 'a' is equal to the constant value 'b', set the
  program counter to the address of the label specified, so the program continues
  from there`,operands:[["a","address"],["b","constant"],["destination","label"]],execute:(t,e,s)=>{r.get(t)===e&&(u.programCounter=s)}},le={name:"branch_if_not_equal_constant",opcode:9104,description:`if the value at address 'a' is not equal to the constant value 'b', set
  the program counter to the address of the label specified, so the program
  continues from there`,operands:[["a","address"],["b","constant"],["destination","label"]],execute:(t,e,s)=>{r.get(t)!==e&&(u.programCounter=s)}},pe={jump_to:de,branch_if_equal:ie,branch_if_equal_constant:ue,branch_if_not_equal:ce,branch_if_not_equal_constant:le},w=pe;var me={...T,...U,...v,...w,...O},I=me;var C={$(t){let e=document.querySelector(t);if(e==null)throw new Error(`couldn't find selector '${t}'`);return e},$Input(t){let e=C.$(t);if(e instanceof HTMLInputElement)return e;throw new Error("expected HTMLInputElement")},$TextArea(t){let e=C.$(t);if(e instanceof HTMLTextAreaElement)return e;throw new Error("expected HTMLTextAreaElement")},$Button(t){let e=C.$(t);if(e instanceof HTMLButtonElement)return e;throw new Error("expected HTMLButtonElement")},$Canvas(t){let e=C.$(t);if(e instanceof HTMLCanvasElement)return e;throw new Error("expected HTMLCanvasElement")},$Select(t){let e=C.$(t);if(e instanceof HTMLSelectElement)return e;throw new Error("expected HTMLSelectElement")},virtualizedScrollView(t,e,s,n,o){t.innerHTML="",Object.assign(t.style,{height:`${e}px`,overflow:"auto"});let i=document.createElement("div");Object.assign(i.style,{height:`${s*n}px`,overflow:"hidden"}),t.appendChild(i);let a=document.createElement("div");i.appendChild(a);let m=10,p=()=>requestAnimationFrame(()=>{let l=Math.max(0,Math.floor(t.scrollTop/s)-m),f=Math.min(n,Math.ceil((t.scrollTop+e)/s)+m),R=l*s;a.style.transform=`translateY(${R}px)`,a.innerHTML=o(l,f),console.log("wsa-row",a)});return t.onscroll=p,p}},x=C;function he(){let t=b(x.$Canvas("#canvas"));return u.init(I),h.init(t.getContext("2d")),E.init(t),g.init(),_.init(I),{resetMemory:()=>{for(let e=0;e<3100;e++)r.ram[e]=0},getMemory:e=>r.ram[e],isRunning:()=>u.running,isHalted:()=>u.halted,getProgramCounter:()=>u.programCounter,resetCPU:()=>u.reset(),setRunning:e=>u.running=e,step:()=>u.step(),getOpcodesToInstructions:()=>u.opcodesToInstructions,getInstructions:()=>u.instructions,updateAudio:()=>g.updateAudio(),drawScreen:()=>h.drawScreen(),parseProgramText:e=>_.parseProgramText(e),assembleAndLoadProgram:e=>_.assembleAndLoadProgram(e)}}export{he as default};
