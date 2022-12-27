////////////////////////////////
////   FLOOR PLAN VIEW     ////
//////////////////////////////

var app
var viewContainer
var viewEditor
var viewControl
var viewcontrolUpper
var viewcontrolDown
var viewPanel
var viewTool
var viewBack
var moveButton

var pathEnd = []
var circleArray = []
var mainPathArray = []

var pathEndGroup
var d
var svg
var g

var path 
var resolution = 10
var r = 8

var isOpenRoom = true
var isMeetings =  false
var isFacilities = false
var isPeople = false

var fplanWidth = 950, fplanHeight = 775
var fplan
var fplanGroup
var tool_tip
var shortRoute

var url = 'https://dev.lsquared.com/floorplan/api'

// var url = 'http://localhost:8080'

  
//App
app = document.querySelector("#app")
    
//Container
viewContainer = document.createElement("div")
viewContainer.classList.add("container")
app.appendChild(viewContainer)
   
//Editor   
viewEditor = document.createElement("div")
viewEditor.setAttribute("id", "floorPlan")
viewEditor.classList.add("editor")
viewContainer.appendChild(viewEditor)
   
//Control Section
viewControl = document.createElement("div")
viewControl.classList.add("control")
viewContainer.appendChild(viewControl)
   
//Upper Control
viewcontrolUpper = document.createElement("div")
viewcontrolUpper.classList.add("view-control-upper")
viewControl.appendChild(viewcontrolUpper)
   
//Upper Control
viewcontrolMiddle = document.createElement("div")
viewcontrolMiddle.classList.add("view-control-middle")
viewControl.appendChild(viewcontrolMiddle)
   
//Down Control
viewcontrolDown = document.createElement("div")
viewcontrolDown.classList.add("view-control-down")
viewControl.appendChild(viewcontrolDown)
   
//Heading
viewPanel = document.createElement("h2")
viewcontrolMiddle.appendChild(viewPanel)

//Short Route
shortRoute = document.createElement("p")
shortRoute.setAttribute("id", "shortRoute")
      
//Floor plan
fplan = d3
      .select("#floorPlan")
      .append("svg")
      .attr("height", fplanHeight)
      .attr("width", fplanWidth)

///////////////////
// VIEW FUNCTION//
/////////////////

function ViewFx(array){

    if(fplanGroup) fplanGroup.remove()

    fplanGroup = fplan
    .append("g")
    .attr("height", fplanHeight)
    .attr("width", fplanWidth)

    fplanGroup
    .append("foreignObject")
    .attr("width", 100)
    .attr("height", 100)
    .attr("transform", "translate(220, 620)")
    .html(`
    <div class="request-loader">
    <button type="button" class="pulse smoky">
    <span class="sr-only">Your action here</span>
    </button>
    </div>
     `)

    tool_tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function (d) {
        if(d.statusName){
         return d.innerHTML
        }else{
          return `<p style="padding:0 0 10px;">${d.textValue}</p>`
        }
      })
    
    
    fplanGroup.call(tool_tip)
    
    
    fplanGroup
      .selectAll("circle")
      .data(circleArray)
      .enter()
      .append("circle")
      .attr("id", function (d) {
        if(d) return d.statusName
      })
      .attr("r", function(d){
        if(d) return 7
      })
      .attr("cx", function (d) {
        if(d) return d.x
      })
      .attr("cy", function (d) {
        if(d) return d.y
      })
      .attr("fill",  function(d) { 
        if(d){       
        if (d.statusName == "AVAILABLE") {return "#00E676"}  
        else if (d.statusName == "OCCUPIED") {return "red"}
        else { return "#00E676" }     
        }        
      }) 
      .attr("stroke", function(d){
        if(d){       
          if (d.statusName == "AVAILABLE") {return "#2C682C"}  
          else if (d.statusName == "OCCUPIED") {return "#990101"}
          else { return "#2C682C" }     
          }
      })
      .attr("stroke-width", function(d){
        if(d) return 3
      })
      .on("click", tool_tip.show)
      .on("mouseout", tool_tip.hide)  
    
    //Paths
    
    this.pathsFx = function(){

    if(pathEnd == undefined) viewList(array)

    fplanGroup.select("g").remove()
    fplanGroup.select("g").remove()
      
    shortRoute.innerHTML = ""
    
    var pathLineEnd = d3
      .line()
      .y(function (d) {
        return d.y
      })
      .x(function (d) {
        return d.x
      })

    pathEndGroup = fplanGroup.append("g")
    
    PathEnd = pathEndGroup
      .append("path")
      .attr("d", pathLineEnd(pathEnd))
      .attr("class", "Path")
      .attr("stroke", "#bd3444bf")
      .attr("stroke-width", "4")
      .attr("stroke-linejoin", "round")
      .attr("opacity", 0)
      .attr("fill", "none")
    
    var LengthEnd = PathEnd.node().getTotalLength()
    
    
    PathEnd.attr("stroke-dasharray", LengthEnd + " " + LengthEnd)
      .attr("stroke-dashoffset", LengthEnd)
      .transition()
      .duration(1000)
      .attr("opacity", 1)
      .transition()
      .duration(LengthEnd*12)
      // .delay(100)
      // .ease(d3.easeCubicIn)
      .attr("stroke-dashoffset", 0)
      .attr("transform", "translate(0,0)")
      .transition()
      .duration(LengthEnd*12)
      // .delay(0)

      // viewControl.appendChild(shortRoute)
  }
}



function viewList(array) {

  if(array == floorMap){
      fetch(`${url}/paths/meeting`)
      .then((response) => response.json())
      .then((data) => { 
        data.forEach(el => {
          mainPathArray = ([...el.data])
        })
   })

   for(let i = 0; i < array.length; i++){
     moveButton = document.createElement("span")
     moveButton.classList.add("single-destination", "destination")
  
    if(array[i].statusName == "AVAILABLE"){
      moveButton.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
          <h3><i class="fa fa-check-circle" style="color:green;"></i>&nbsp;${array[i].roomName}</h3>
        <div style="display:inline-block;">
          <p style="padding-bottom: 10px;">NEXT MEETING</p>
          <p style="font-size:20px;">3:00PM - 4:30PM</pstyle>
          <p>Assin, Sharon</p>
        </div>
        <img style="width:60px; height:60px" src="./images/map.png" alt="map">
      </div>
      <br>
      `
    }
    if(array[i].statusName == "OCCUPIED"){
      moveButton.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
      <h3><i class="fa fa-check-circle" style="color:red;"></i>&nbsp;${array[i].roomName}</h3>
    <div style="display:inline-block;">
      <p style="padding-bottom: 10px;">CURRENT MEETING</p>
      <p style="font-size:20px;">3:00PM - 4:30PM</pstyle>
      <p>Assin, Sharon</p>
    </div>
    <img style="width:60px; height:60px" src="./images/map.png" alt="map">
  </div>
  <br>
    `
    }
  
 
    moveButton.style.display = "block"
    viewcontrolMiddle.appendChild(moveButton)
    moveButton.onclick = function(){
      pathEnd = mainPathArray[i]
      if(pathEndGroup) pathEndGroup.remove()

      let a = new ViewFx()
      a.pathsFx()

      pathEnd = []
    }
  }
 }

 if(array == openRoom){

  fetch(`${url}/paths/open-room`)
  .then((response) => response.json())
  .then((data) => { 
    data.forEach(el => {
      mainPathArray = ([...el.data])
    })
  });

  for(let i = 0; i < array.length; i++){
    moveButton = document.createElement("span")
    moveButton.classList.add("single-destination", "destination")
  
    if(array[i].statusName == "AVAILABLE"){
       icon = `<i class="fa fa-check-circle" style="color:green;"></i>`
    }
    if(array[i].statusName == "OCCUPIED"){
       icon = `<i class="fa fa-times-circle" style="color:red;"></i>`
    }
  
    moveButton.innerHTML = `
    <div style="display:flex;justify-content:space-between;">
    <span>${icon} ${array[i].roomName}</span>
    <img style="width:20px; height:20px" src="./images/map.png" alt="map">
    `
    moveButton.style.display = "block"
    viewcontrolMiddle.appendChild(moveButton)
    moveButton.onclick = function(){
      pathEnd = mainPathArray[i]
      if(pathEndGroup) pathEndGroup.remove()

      let a = new ViewFx()
      a.pathsFx()
      pathEnd = []
    }
  }
 }

 if(array == facilities){

  fetch(`${url}/paths/facility`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach(el => {
      mainPathArray = ([...el.data])
    })
  });

  for(let i = 0; i < array.length; i++){
    moveButton = document.createElement("span")
    moveButton.classList.add("single-destination", "destination")

    icon = `<i class="fa fa-check-circle" style="color:#0060a9;"></i>`
    moveButton.innerHTML = `
    <div style="display:flex;justify-content:space-between;">
    <span>${icon} ${array[i].roomName}</span>
    <img style="width:20px; height:20px" src="./images/map.png" alt="map">
    `
    moveButton.style.display = "block"
    viewcontrolMiddle.appendChild(moveButton)
    moveButton.onclick = function(){
      pathEnd = mainPathArray[i]
      if(pathEndGroup) pathEndGroup.remove()

      let a = new ViewFx()
      a.pathsFx()
      pathEnd = []
    }
  }
 }

 if(array == people){

  fetch(`${url}/paths/people`)
  .then((response) => response.json())
  .then((data) => { 
    data.forEach(el => {
      mainPathArray = ([...el.data])
    })
  });

  for(let i = 0; i < array.length; i++){
    moveButton = document.createElement("span")
    moveButton.classList.add("single-destination", "destination")
  
    moveButton.innerHTML = `
    <div style="display:flex;">
    <img style="width:100px; height:100px" src="./images/profile-dummy.png" alt="profile-picture">
    <div style="display:inline-block;padding: 0 15px">
    <h3>${array[i].roomName}</h3>
    <p style="font-size:18px;">${array[i].department}</p>
    </div>
    </div>
    <br>
    <hr>
    <br>
    <div style="display:flex;justify-content:space-between;">
    <div style="display:inline-block;">
    <p style="font-size:17px;">${array[i].floorDisplayName}</p>
    <p style="font-size:17px;">${array[i].deskDisplayName}</p>
    </div>
    <img style="width:50px; height:50px" src="./images/map.png" alt="map">
    </div>
    <br>
    `
    moveButton.style.display = "block"
    viewcontrolMiddle.appendChild(moveButton)
    moveButton.onclick = function(){
      pathEnd = mainPathArray[i]
      if(pathEndGroup) pathEndGroup.remove()

      let a = new ViewFx()
      a.pathsFx()
      pathEnd = []
    }
  }
}

}

//View Tools
viewTool = document.createElement("div")
viewTool.classList.add("view-tool")
viewcontrolDown.appendChild(viewTool) 


let tab1 = document.createElement("button")
tab1.classList.add("view-tool-link", "active")
viewTool.appendChild(tab1)
tab1.textContent = "OPEN ROOMS"
viewPanel.textContent = "OPEN ROOMS"
fetch(`${url}/destinations/open-room`)
.then((response) => response.json())
.then((data) => { 
data.forEach(el => {
  circleArray = [...el.data]
})
if(circleArray) new ViewFx(openRoom)
})
viewList(openRoom)

tab1.onclick = function(event){
  if(fplanGroup) fplanGroup.selectAll("g").remove(); document.querySelectorAll('.destination').forEach(e => e.remove())
  if(fplanGroup) fplanGroup.remove()
  if(pathEndGroup) pathEndGroup.remove()
  circleArray = []
  mainPathArray = []

  viewList(openRoom)

  fetch(`${url}/destinations/open-room`)
  .then((response) => response.json())
  .then((data) => { 
  data.forEach(el => {
    circleArray = [...el.data]
  })
  if(circleArray) new ViewFx(openRoom)
  })

  viewPanel.textContent = "OPEN ROOMS"
  loadContent(event, "OPEN ROOMS")
}



let tab2 = document.createElement("button")
tab2.classList.add("view-tool-link")
viewTool.appendChild(tab2)
tab2.textContent = "MEETINGS"

tab2.onclick = function(event){
  if(fplanGroup) fplanGroup.selectAll("g").remove(); document.querySelectorAll('.destination').forEach(e => e.remove())
  if(fplanGroup) fplanGroup.remove()
  if(pathEndGroup) pathEndGroup.remove()
  circleArray = []
  mainPathArray = []

  viewList(floorMap)
  
  fetch(`${url}/destinations/meeting`)
  .then((response) => response.json())
  .then((data) => { 
  data.forEach(el => {
    circleArray = [...el.data]
  })
  if(circleArray) new ViewFx(floorMap)
  })

  viewPanel.textContent = "MEETINGS"
  // viewBack = document.createElement("i")
  // viewBack.classList.add("fa", "fa-pencil")
  // viewBack.setAttribute("aria-hidden", "true")
  // viewBack.style.marginLeft = "10px"
  // viewPanel.appendChild(viewBack)
  // viewBack.onclick = function(){
  // new EditorFx()
  // container.style.display = "flex"
  // viewContainer.style.display = "none" }
  loadContent(event, "MEETINGS")
}

let tab3 = document.createElement("button")
tab3.classList.add("view-tool-link")
viewTool.appendChild(tab3)
tab3.textContent = "FACILITIES"

tab3.onclick = function(event){
  if(fplanGroup) fplanGroup.selectAll("g").remove(); document.querySelectorAll('.destination').forEach(e => e.remove())
  if(fplanGroup) fplanGroup.remove()
  if(pathEndGroup) pathEndGroup.remove()
  circleArray = []
  mainPathArray = []

  viewList(facilities)

  fetch(`${url}/destinations/facility`)
  .then((response) => response.json())
  .then((data) => { 
  data.forEach(el => {
    circleArray = [...el.data]
  })
  if(circleArray) new ViewFx(facilities)
  })


  viewPanel.textContent = "FACILITIES"
  loadContent(event, "FACILITIES")
}


let tab4 = document.createElement("button")
tab4.classList.add("view-tool-link")
viewTool.appendChild(tab4)
tab4.textContent = "PEOPLE"
tab4.onclick = function(event){
  if(fplanGroup) fplanGroup.selectAll("g").remove(); document.querySelectorAll('.destination').forEach(e => e.remove())
  if(fplanGroup) fplanGroup.remove()
  if(pathEndGroup) pathEndGroup.remove()
  circleArray = []
  mainPathArray = []

  viewList(people)

  fetch(`${url}/destinations/people`)
  .then((response) => response.json())
  .then((data) => { 
  data.forEach(el => {
    circleArray = [...el.data]
  })
  if(circleArray) new ViewFx(people)
  })

  
  viewPanel.textContent = "PEOPLE"
  loadContent(event, "PEOPLE")
}




function loadContent(e, title){

  var tablinks = document.getElementsByClassName("view-tool-link")
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "")
  }
  e.currentTarget.className += " active"
}


