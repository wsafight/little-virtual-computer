var d=class o{static CYCLES_PER_YIELD=997;static delayBetweenCycles=0;static computer;static loop(){if(o.delayBetweenCycles===0)for(let t=0;t<o.CYCLES_PER_YIELD;t++){if(!this.computer.isRunning()){o.stop();break}this.computer.step()}else this.computer.step(),c.updateUI();o.updateOutputs(),this.computer.isRunning()&&setTimeout(()=>o.loop(),o.delayBetweenCycles)}static run(){this.computer.setRunning(!0),c.updateProgramMemoryView(),c.updateUI(),c.updateSpeedUI(),this.loop()}static stop(){this.computer.setRunning(!1),c.updateProgramMemoryView(),c.updateUI(),c.updateSpeedUI()}static updateOutputs(){this.computer.drawScreen(),this.computer.updateAudio()}static init(t){this.computer=t}static loadProgramAndReset(){this.computer.resetMemory();let t=c.getProgramText();console.log(t);try{this.computer.assembleAndLoadProgram(this.computer.parseProgramText(t))}catch(r){alert(r.message),console.error(r)}c.setLoadedProgramText(t),this.computer.resetCPU(),this.updateOutputs(),c.updateProgramMemoryView(),c.updateUI(),c.updateSpeedUI()}static stepOnce(){this.computer.setRunning(!0),this.computer.step(),this.computer.setRunning(!1),this.updateOutputs(),c.updateUI()}static runStop(){this.computer.isRunning()?this.stop():this.run()}};var I=(s=>(s[s.TOTAL_MEMORY_SIZE=3100]="TOTAL_MEMORY_SIZE",s[s.WORKING_MEMORY_START=0]="WORKING_MEMORY_START",s[s.WORKING_MEMORY_END=1e3]="WORKING_MEMORY_END",s[s.PROGRAM_MEMORY_START=1e3]="PROGRAM_MEMORY_START",s[s.PROGRAM_MEMORY_END=2e3]="PROGRAM_MEMORY_END",s[s.KEYCODE_0_ADDRESS=2e3]="KEYCODE_0_ADDRESS",s[s.KEYCODE_1_ADDRESS=2001]="KEYCODE_1_ADDRESS",s[s.KEYCODE_2_ADDRESS=2002]="KEYCODE_2_ADDRESS",s[s.MOUSE_X_ADDRESS=2010]="MOUSE_X_ADDRESS",s[s.MOUSE_Y_ADDRESS=2011]="MOUSE_Y_ADDRESS",s[s.MOUSE_PIXEL_ADDRESS=2012]="MOUSE_PIXEL_ADDRESS",s[s.MOUSE_BUTTON_ADDRESS=2013]="MOUSE_BUTTON_ADDRESS",s[s.RANDOM_NUMBER_ADDRESS=2050]="RANDOM_NUMBER_ADDRESS",s[s.CURRENT_TIME_ADDRESS=2051]="CURRENT_TIME_ADDRESS",s[s.VIDEO_MEMORY_START=2100]="VIDEO_MEMORY_START",s[s.VIDEO_MEMORY_END=3e3]="VIDEO_MEMORY_END",s[s.AUDIO_CH1_WAVE_TYPE_ADDRESS=3e3]="AUDIO_CH1_WAVE_TYPE_ADDRESS",s[s.AUDIO_CH1_FREQUENCY_ADDRESS=3001]="AUDIO_CH1_FREQUENCY_ADDRESS",s[s.AUDIO_CH1_VOLUME_ADDRESS=3002]="AUDIO_CH1_VOLUME_ADDRESS",s[s.AUDIO_CH2_WAVE_TYPE_ADDRESS=3003]="AUDIO_CH2_WAVE_TYPE_ADDRESS",s[s.AUDIO_CH2_FREQUENCY_ADDRESS=3004]="AUDIO_CH2_FREQUENCY_ADDRESS",s[s.AUDIO_CH2_VOLUME_ADDRESS=3005]="AUDIO_CH2_VOLUME_ADDRESS",s[s.AUDIO_CH3_WAVE_TYPE_ADDRESS=3006]="AUDIO_CH3_WAVE_TYPE_ADDRESS",s[s.AUDIO_CH3_FREQUENCY_ADDRESS=3007]="AUDIO_CH3_FREQUENCY_ADDRESS",s[s.AUDIO_CH3_VOLUME_ADDRESS=3008]="AUDIO_CH3_VOLUME_ADDRESS",s))(I||{}),e=I;var S={$(o){let t=document.querySelector(o);if(t==null)throw new Error(`couldn't find selector '${o}'`);return t},$Input(o){let t=S.$(o);if(t instanceof HTMLInputElement)return t;throw new Error("expected HTMLInputElement")},$TextArea(o){let t=S.$(o);if(t instanceof HTMLTextAreaElement)return t;throw new Error("expected HTMLTextAreaElement")},$Button(o){let t=S.$(o);if(t instanceof HTMLButtonElement)return t;throw new Error("expected HTMLButtonElement")},$Canvas(o){let t=S.$(o);if(t instanceof HTMLCanvasElement)return t;throw new Error("expected HTMLCanvasElement")},$Select(o){let t=S.$(o);if(t instanceof HTMLSelectElement)return t;throw new Error("expected HTMLSelectElement")},virtualizedScrollView(o,t,r,n,a){o.innerHTML="",Object.assign(o.style,{height:`${t}px`,overflow:"auto"});let i=document.createElement("div");Object.assign(i.style,{height:`${r*n}px`,overflow:"hidden"}),o.appendChild(i);let l=document.createElement("div");i.appendChild(l);let _=10,M=()=>requestAnimationFrame(()=>{let f=Math.max(0,Math.floor(o.scrollTop/r)-_),w=Math.min(n,Math.ceil((o.scrollTop+t)/r)+_),$=f*r;l.style.transform=`translateY(${$}px)`,l.innerHTML=a(f,w),console.log("wsa-row",l)});return o.onscroll=M,M}},u=S;function m(o,t){let r=o+"",n=[r];for(let a=r.length;a<t;a++)n.push(" ");return n.join("")}var c=class o{static selectedProgram=localStorage.getItem("selectedProgram")||"RandomPixels";static loadedProgramText="";static itemHeight=14;static lines;static computer;static programs={};static initUI(t={}){this.programs=t;let r=u.$Select("#programSelector");Object.keys(t).forEach(n=>{let a=document.createElement("option");a.value=n,a.textContent=n,r.append(a)}),r.value=this.selectedProgram,this.selectProgram()}static getProgramText(){return u.$TextArea("#program").value}static getCanvas(){return u.$Canvas("#canvas")}static init(t){this.computer=t}static initScreen(t,r,n){let a="pixelated";/firefox/i.test(navigator.userAgent)&&(a="-moz-crisp-edges"),Object.assign(o.getCanvas(),{width:t,height:r}),Object.assign(o.getCanvas().style,{transformOrigin:"top left",transform:`scale(${n})`,"-ms-interpolation-mode":"nearest-neighbor",imageRendering:a})}static setLoadedProgramText(t){this.loadedProgramText=t,u.$Button("#loadProgramButton").disabled=!0}static updateLoadProgramButton(){u.$Button("#loadProgramButton").disabled=this.loadedProgramText===this.getProgramText()}static selectProgram(){this.selectedProgram=u.$Select("#programSelector").value,localStorage.setItem("selectedProgram",this.selectedProgram),u.$TextArea("#program").value=localStorage.getItem(this.selectedProgram)||this.programs[this.selectedProgram]||"",this.updateLoadProgramButton()}static editProgramText(){this.selectedProgram.startsWith("Custom")&&localStorage.setItem(this.selectedProgram,u.$TextArea("#program").value),this.updateLoadProgramButton()}static setSpeed(){d.delayBetweenCycles=-parseInt(u.$Input("#speed").value,10),this.updateSpeedUI()}static setFullSpeed(){let t=u.$Input("#full-speed");t&&t.checked?d.delayBetweenCycles=0:d.delayBetweenCycles=1,this.updateSpeedUI()}static updateSpeedUI(){let t=d.delayBetweenCycles===0,r=this.computer.isRunning()&&t;u.$Input("#full-speed").checked=t,u.$Input("#speed").value=String(-d.delayBetweenCycles),u.$("#debugger").classList.toggle("full-speed",r),u.$("#debuggerMessageArea").textContent=r?"debug UI disabled when CPU.running at full speed":""}static updateUI(){u.$Input("#programCounter").value=String(this.computer.getProgramCounter()),this.computer.isHalted()?(u.$("#running").textContent="halted",u.$Button("#stepButton").disabled=!0,u.$Button("#runButton").disabled=!0):(u.$("#running").textContent=this.computer.isRunning()?"running":"paused",u.$Button("#stepButton").disabled=!1,u.$Button("#runButton").disabled=!1),this.updateWorkingMemoryView(),this.updateInputMemoryView(),this.updateVideoMemoryView(),this.updateAudioMemoryView(),(d.delayBetweenCycles>300||!this.computer.isRunning())&&typeof this.scrollToProgramLine=="function"&&this.scrollToProgramLine(Math.max(0,this.computer.getProgramCounter()-e.PROGRAM_MEMORY_START-3))}static updateWorkingMemoryView(){let t=[];for(let r=e.WORKING_MEMORY_START;r<e.WORKING_MEMORY_END;r++)t.push(`${r}: ${this.computer.getMemory(r)}`);u.$TextArea("#workingMemoryView").textContent=t.join(`
`)}static scrollToProgramLine(t){u.$("#programMemoryView").scrollTop=t*this.itemHeight,this.renderProgramMemoryView()()}static renderProgramMemoryView(){return u.$("#programMemoryView").innerHTML="",u.virtualizedScrollView(u.$("#programMemoryView"),136,this.itemHeight,this.lines.length,(t,r)=>this.lines.slice(t,r).map((n,a)=>{let i=e.PROGRAM_MEMORY_START+t+a===this.computer.getProgramCounter();return`
  <pre
    class="table-row"
    style="height: ${this.itemHeight}px; background: ${i?"#eee":"none"}"
  >${n}</pre>
            `}).join(""))}static updateProgramMemoryView(){let t=[];for(let r=e.PROGRAM_MEMORY_START;r<e.PROGRAM_MEMORY_END;r++){let n=this.computer.getOpcodesToInstructions().get(this.computer.getMemory(r));if(t.push(`${m(r,4)}: ${m(this.computer.getMemory(r),8)} ${n||""}`),n){let a=this.computer.getInstructions()[n].operands;for(let i=0;i<a.length;i++)t.push(`${m(r+1+i,4)}: ${m(this.computer.getMemory(r+1+i),8)}   ${a[i][0]} (${a[i][1]})`);r+=a.length}}this.lines=t,this.renderProgramMemoryView()()}static updateInputMemoryView(){u.$TextArea("#inputMemoryView").textContent=`${e.KEYCODE_0_ADDRESS}: ${m(this.computer.getMemory(e.KEYCODE_0_ADDRESS),8)} keycode 0
${e.KEYCODE_1_ADDRESS}: ${m(this.computer.getMemory(e.KEYCODE_1_ADDRESS),8)} keycode 1
${e.KEYCODE_2_ADDRESS}: ${m(this.computer.getMemory(e.KEYCODE_2_ADDRESS),8)} keycode 2
${e.MOUSE_X_ADDRESS}: ${m(this.computer.getMemory(e.MOUSE_X_ADDRESS),8)} mouse x
${e.MOUSE_Y_ADDRESS}: ${m(this.computer.getMemory(e.MOUSE_Y_ADDRESS),8)} mouse y
${e.MOUSE_PIXEL_ADDRESS}: ${m(this.computer.getMemory(e.MOUSE_PIXEL_ADDRESS),8)} mouse pixel
${e.MOUSE_BUTTON_ADDRESS}: ${m(this.computer.getMemory(e.MOUSE_BUTTON_ADDRESS),8)} mouse button
${e.RANDOM_NUMBER_ADDRESS}: ${m(this.computer.getMemory(e.RANDOM_NUMBER_ADDRESS),8)} random number
${e.CURRENT_TIME_ADDRESS}: ${m(this.computer.getMemory(e.CURRENT_TIME_ADDRESS),8)} current time`}static updateVideoMemoryView(){let t=[];for(let r=e.VIDEO_MEMORY_START;r<e.VIDEO_MEMORY_END;r++)t.push(`${r}: ${this.computer.getMemory(r)}`);u.$TextArea("#videoMemoryView").textContent=t.join(`
`)}static updateAudioMemoryView(){u.$TextArea("#audioMemoryView").textContent=`${e.AUDIO_CH1_WAVE_TYPE_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH1_WAVE_TYPE_ADDRESS),8)} audio ch1 wavetype
${e.AUDIO_CH1_FREQUENCY_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH1_FREQUENCY_ADDRESS),8)} audio ch1 frequency
${e.AUDIO_CH1_VOLUME_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH1_VOLUME_ADDRESS),8)} audio ch1 volume
${e.AUDIO_CH2_WAVE_TYPE_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH2_WAVE_TYPE_ADDRESS),8)} audio ch2 wavetype
${e.AUDIO_CH2_FREQUENCY_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH2_FREQUENCY_ADDRESS),8)} audio ch2 frequency
${e.AUDIO_CH2_VOLUME_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH2_VOLUME_ADDRESS),8)} audio ch2 volume
${e.AUDIO_CH3_WAVE_TYPE_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH3_WAVE_TYPE_ADDRESS),8)} audio ch3 wavetype
${e.AUDIO_CH3_FREQUENCY_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH3_FREQUENCY_ADDRESS),8)} audio ch3 frequency
${e.AUDIO_CH3_VOLUME_ADDRESS}: ${m(this.computer.getMemory(e.AUDIO_CH3_VOLUME_ADDRESS),8)} audio ch3 volume`}};var E=class{static ram=[];static set(t,r){if(isNaN(r))throw new Error(`tried to write to an invalid value at ${t}`);if(t<0||t>=3100)throw new Error("tried to write to an invalid memory address");this.ram[t]=r}static get(t){if(t<0||t>=3100)throw new Error("tried to read from an invalid memory address");return this.ram[t]}};function A(o){if(o!=null)return o;throw new Error("unexpected null")}var y={0:[0,0,0],1:[255,255,255],2:[255,0,0],3:[0,255,0],4:[0,0,255],5:[255,255,0],6:[0,255,255],7:[255,0,255],8:[192,192,192],9:[128,128,128],10:[128,0,0],11:[128,128,0],12:[0,128,0],13:[128,0,128],14:[0,128,128],15:[0,0,128]},p=class o{static SCREEN_WIDTH=30;static SCREEN_HEIGHT=30;static SCREEN_PIXEL_SCALE=20;static imageData;static canvasCtx;static getColor(t,r){let n=y[t];if(!n)throw new Error(`Invalid color code ${t} at address ${r}`);return n}static init(t){o.canvasCtx=t,this.imageData=t.createImageData(o.SCREEN_WIDTH,o.SCREEN_HEIGHT)}static drawScreen(){let t=A(this.imageData),r=e.VIDEO_MEMORY_END-e.VIDEO_MEMORY_START,n=t.data;for(let i=0;i<r;i++){let l=E.ram[e.VIDEO_MEMORY_START+i],_=this.getColor(l||"0",e.VIDEO_MEMORY_START+i);n[i*4]=_[0],n[i*4+1]=_[1],n[i*4+2]=_[2],n[i*4+3]=255}A(this.canvasCtx).putImageData(t,0,0)}};var D=class o{static keysPressed=new Set;static mouseDown=!1;static mouseX=0;static mouseY=0;static init(t){if(!document.body)throw new Error("DOM not ready");document.body.onkeydown=a=>{o.keysPressed.add(a.key)},document.body.onkeyup=a=>{this.keysPressed.delete(a.key)},document.body.onmousedown=()=>{this.mouseDown=!0},document.body.onmouseup=()=>{this.mouseDown=!1};let r=t.getBoundingClientRect().top+window.scrollY,n=t.getBoundingClientRect().left+window.scrollX;t.onmousemove=a=>{this.mouseX=Math.floor((a.pageX-n)/p.SCREEN_PIXEL_SCALE),this.mouseY=Math.floor((a.pageY-r)/p.SCREEN_PIXEL_SCALE)}}static updateInputs(){let t=Array.from(o.keysPressed.values()).reverse();E.ram[e.KEYCODE_0_ADDRESS]=t[0]||0,E.ram[e.KEYCODE_1_ADDRESS]=t[1]||0,E.ram[e.KEYCODE_2_ADDRESS]=t[2]||0,E.ram[e.MOUSE_BUTTON_ADDRESS]=o.mouseDown?1:0,E.ram[e.MOUSE_X_ADDRESS]=o.mouseX,E.ram[e.MOUSE_Y_ADDRESS]=o.mouseY,E.ram[e.MOUSE_PIXEL_ADDRESS]=e.VIDEO_MEMORY_START+Math.floor(this.mouseY)*p.SCREEN_WIDTH+Math.floor(this.mouseX),E.ram[e.RANDOM_NUMBER_ADDRESS]=Math.floor(Math.random()*255),E.ram[e.CURRENT_TIME_ADDRESS]=Date.now()}};var g=class{static programCounter=e.PROGRAM_MEMORY_START;static running=!1;static halted=!1;static instructionsToOpcodes=new Map;static opcodesToInstructions=new Map;static instructions;static init(t){this.instructions=t,Object.keys(t).forEach(r=>{let n=t[r].opcode;this.instructionsToOpcodes.set(r,n),this.opcodesToInstructions.set(n,r)})}static step(){D.updateInputs();let t=this.advanceProgramCounter(),r=this.opcodesToInstructions.get(t);if(!r)throw new Error(`Unknown opcode '${t}'`);let n=this.instructions[r].operands.map(()=>this.advanceProgramCounter());this.instructions[r].execute.apply(null,n)}static advanceProgramCounter(){if(this.programCounter<e.PROGRAM_MEMORY_START||this.programCounter>=e.PROGRAM_MEMORY_END)throw new Error(`program counter outside valid program memory region at ${this.programCounter}`);return E.get(this.programCounter++)}static reset(){this.programCounter=e.PROGRAM_MEMORY_START,this.halted=!1,this.running=!1}};var x=window.AudioContext||window.webkitAudioContext,T={0:"square",1:"sawtooth",2:"triangle",3:"sine"},R=class{static MAX_GAIN=.15;static audioChannels=[];static audioCtx=new x;static addAudioChannel(t,r,n){let a=this.audioCtx.createOscillator(),i=this.audioCtx.createGain();a.connect(i),i.connect(this.audioCtx.destination);let l={gain:0,oscillatorType:T[0],frequency:440};return i.gain.value=l.gain,a.type=l.oscillatorType,a.frequency.value=l.frequency,a.start(),this.audioChannels.push({state:l,waveTypeAddr:t,freqAddr:r,volAddr:n,gainNode:i,oscillatorNode:a})}static updateAudio(){this.audioChannels.forEach(t=>{let r=(E.ram[t.freqAddr]||0)/1e3,n=g.running?(E.ram[t.volAddr]||0)/100*this.MAX_GAIN:0,a=T[E.ram[t.waveTypeAddr]]||T[0],{state:i}=t;i.gain!==n&&(t.gainNode.gain.setValueAtTime(n,this.audioCtx.currentTime),i.gain=n),i.oscillatorType!==a&&(t.oscillatorNode.type=a,i.oscillatorType=a),i.frequency!==r&&(t.oscillatorNode.frequency.setValueAtTime(r,this.audioCtx.currentTime),i.frequency=r)})}static init(){this.addAudioChannel(e.AUDIO_CH1_WAVE_TYPE_ADDRESS,e.AUDIO_CH1_FREQUENCY_ADDRESS,e.AUDIO_CH1_VOLUME_ADDRESS),this.addAudioChannel(e.AUDIO_CH2_WAVE_TYPE_ADDRESS,e.AUDIO_CH2_FREQUENCY_ADDRESS,e.AUDIO_CH2_VOLUME_ADDRESS),this.addAudioChannel(e.AUDIO_CH3_WAVE_TYPE_ADDRESS,e.AUDIO_CH3_FREQUENCY_ADDRESS,e.AUDIO_CH3_VOLUME_ADDRESS)}};function Y(o,t){if(c.init(o),c.initScreen(30,30,20),c.initUI(t),d.init(o),d.loadProgramAndReset(),!document.body)throw new Error("DOM not ready");function r(){if(!document.body)throw new Error("DOM not ready");document.body.removeEventListener("click",r),R.audioCtx.resume()}return document.body.addEventListener("click",r),{selectProgram:()=>c.selectProgram(),loadProgramAndReset:()=>d.loadProgramAndReset(),runStop:()=>d.runStop(),stepOnce:()=>d.stepOnce(),editProgramText:()=>c.editProgramText(),setSpeed:()=>c.setSpeed(),setFullSpeed:()=>c.setFullSpeed()}}export{Y as default};
