////////////////////////////////
// FLOOR PLAN EDITOR         ////
//////////////////////////////

var app
var container
var editor
var control
var controlUpper
var controlDown
var panel
var source
var dest
var pathStart = []  
var pathEnd = []
var circleArray = []
var apiArray = []
var pathStartGroup
var PathStart
var pathEndGroup
var counter
var remove
var proceed
var d
var svg
var g
var lineX
var lineY 
var path 
var gMainPoint 
var gInnerPoint 
var circlePoint
var destName
var savePath = document.createElement("button")
var destPoint 
var finalDest
var newDest
var input
var gInner1Point
var circle1Point
var submit
var pathFx
var mainPathArray = []
var resolution = 10
var r = 8
var width = 950
var height = 775
var destAdded 
var isOpenRoom = true
var isMeetings =  false
var isFacilities = false
var isPeople = false
var newDest

var reset

var url = 'https://dev.lsquared.com/floorplan/api'

// var url = 'http://localhost:8080'

//App
app = document.querySelector("#app")

//Container
container = document.createElement("div")
container.classList.add("container")
app.appendChild(container)

//Editor

editor = document.createElement("div")
editor.classList.add("editor")
container.appendChild(editor)

//Control Section
control = document.createElement("div")
control.classList.add("control")
container.appendChild(control)

//Select Type
var select = document.createElement("select")
select.classList.add("dselect")
select.style.marginBottom = "30px"
var option1 = document.createElement("option")
option1.text = "OPEN ROOMS"
select.add(option1)
var option2 = document.createElement("option")
option2.text = "MEETINGS"
select.add(option2)
var option3 = document.createElement("option")
option3.text = "FACILITIES"
select.add(option3)
var option4 = document.createElement("option")
option4.text = "PEOPLE"
select.add(option4)
apiArray = openRoom
control.appendChild(select)

//Heading Panel
panel = document.createElement("h2")
panel.textContent = "Editor Panel"
control.appendChild(panel)

//Upper Control
controlUpper = document.createElement("div")
controlUpper.classList.add("control-upper")
control.appendChild(controlUpper)

//Down Control
controlDown = document.createElement("div")
controlDown.classList.add("control-down")
control.appendChild(controlDown)


//SVG
svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
svg.classList.add("svg")
svg.setAttribute("width", "950")
svg.setAttribute("height", "775")

editor.appendChild(svg)

g = document.createElementNS("http://www.w3.org/2000/svg", "g")
g.classList.add("grid")

for (let i = 10; i <= 950; i += 10) {
  
  lineX = document.createElementNS("http://www.w3.org/2000/svg", "line")
  
  lineX.setAttribute("x1", `${i}`)
  lineX.setAttribute("y1", "0")
  lineX.setAttribute("x2", `${i}`)
  lineX.setAttribute("y2", "775")
  lineX.setAttribute("stroke", "#eee")
  
  g.appendChild(lineX)

  lineY = document.createElementNS("http://www.w3.org/2000/svg", "line")
  
  lineY.setAttribute("x1", "0")
  lineY.setAttribute("y1", `${i}`)
  lineY.setAttribute("x2", "950")
  lineY.setAttribute("y2", `${i}`)
  lineY.setAttribute("stroke", "#eee")
  
  g.appendChild(lineY)
}

svg.appendChild(g)

//Default Open Room Data

fetch(`${url}/paths/open-room`)
.then((response) => response.json())
.then((data) => { 
  data.forEach(el => {
    mainPathArray = ([...el.data])
  })
  
fetch(`${url}/destinations/open-room`)
.then((response) => response.json())
.then((data) => { 
 data.forEach(el => {
  circleArray = [...el.data]
 })

 if(circleArray){
  document.querySelectorAll('.dsubmit').forEach(e => {
  document.querySelectorAll('.save-path').forEach(s => {
  document.querySelectorAll('.dremove').forEach(r => {
  r.disabled = true
  circleArray.forEach((el, i) => {
    if(el){
    newDest = document.createElementNS(
       "http://www.w3.org/2000/svg",
       "circle"
       )
      newDest.setAttribute("cx", `${el.x}`)
      newDest.setAttribute("cy", `${el.y}`)
      newDest.setAttribute("r", `8`)  
      newDest.setAttribute("fill", "#0060a9")
      newDest.setAttribute("id", `${i}`)
      // newDest.setAttribute("stroke", "#555")
      newDest.setAttribute("stroke-width", "0")
      newDest.classList.add("final-destination")
      svg.appendChild(newDest)
      if(el.id != undefined){
        if(i == e.id){
          e.disabled = true
        }
        if(i == s.id){
          s.disabled = true
        }
        if(i == r.id){
          r.disabled = false
        }
      }
     }
    })
   })
   })
  })
 }
})


apiArray = openRoom

if(input) document.querySelectorAll('.dname').forEach(e => e.remove())
if(submit) document.querySelectorAll('.dsubmit').forEach(e => e.remove())
if(reset) document.querySelectorAll('.dremove').forEach(e => e.remove())
if(savePath) document.querySelectorAll('.save-path').forEach(e => e.remove())
if(proceed) proceed.remove()

if(destPoint) destPoint.remove()
if(finalDest) finalDest.remove()
if(newDest) newDest.remove()
if(gMainPoint) gMainPoint.remove()
if(path) path.remove()

isOpenRoom = true
isMeetings =  false
isFacilities = false
isPeople = false

EditorFx()
 
})
//Change on Select

select.onchange = function(e){

  if(e.target.value == "OPEN ROOMS"){
    circleArray = []
    mainPathArray = []

    isOpenRoom = true
    isMeetings =  false
    isFacilities = false
    isPeople = false

    apiArray = openRoom

    if(input) document.querySelectorAll('.dname').forEach(e => e.remove())
    if(submit) document.querySelectorAll('.dsubmit').forEach(e => e.remove())
    if(reset) document.querySelectorAll('.dremove').forEach(e => e.remove())
    if(savePath) document.querySelectorAll('.save-path').forEach(e => e.remove())
    if(proceed) proceed.remove()
    document.querySelectorAll('.final-destination').forEach(e => e.remove())

    fetch(`${url}/paths/open-room`)
   .then((response) => response.json())
   .then((data) => { 
    data.forEach(el => {
      mainPathArray = ([...el.data])
    })

    fetch(`${url}/destinations/open-room`)
    .then((response) => response.json())
    .then((data) => {
     data.forEach(el => {
      circleArray = [...el.data]
     })
     if(circleArray){
      document.querySelectorAll('.dsubmit').forEach(e => {
      document.querySelectorAll('.save-path').forEach(s => {
      document.querySelectorAll('.dremove').forEach(r => {
        r.disabled = true
        circleArray.forEach((el, i) => {
        if(el){
        newDest = document.createElementNS(
           "http://www.w3.org/2000/svg",
           "circle"
           )
          newDest.setAttribute("cx", `${el.x}`)
          newDest.setAttribute("cy", `${el.y}`)
          newDest.setAttribute("r", `8`)  
          newDest.setAttribute("fill", "#0060a9")
          // newDest.setAttribute("stroke", "#555")
          newDest.setAttribute("stroke-width", "0")
          newDest.classList.add("final-destination")
          svg.appendChild(newDest)
          if(el.id != undefined){
           if(i == e.id){
              e.disabled = true
           }
           if(i == s.id){
              s.disabled = true
           }
           if(i == r.id){
            r.disabled = false
          }
          }
         }
        })
       })
       })
      })
     }
    })
    
    //Editor Fx
    EditorFx()

   })
    
    
  }

  if(e.target.value == "MEETINGS"){
    
    circleArray = []
    mainPathArray = []

    apiArray = floorMap

    isOpenRoom = false
    isMeetings =  true
    isFacilities = false
    isPeople = false
    
    if(input) document.querySelectorAll('.dname').forEach(e => e.remove())
    if(submit) document.querySelectorAll('.dsubmit').forEach(e => e.remove())
    if(reset) document.querySelectorAll('.dremove').forEach(e => e.remove())
    if(savePath) document.querySelectorAll('.save-path').forEach(e => e.remove())
    if(proceed) proceed.remove()
    document.querySelectorAll('.final-destination').forEach(e => e.remove())

    fetch(`${url}/paths/meeting`)
    .then((response) => response.json())
    .then((data) => { 
     data.forEach(el => {
       mainPathArray = ([...el.data])
     })

    fetch(`${url}/destinations/meeting`)
    .then((response) => response.json())
    .then((data) => { 
    data.forEach(el => {
      circleArray = [...el.data]
     })
     if(circleArray){
      document.querySelectorAll('.dsubmit').forEach(e => {
      document.querySelectorAll('.save-path').forEach(s => {
        document.querySelectorAll('.dremove').forEach(r => {
          r.disabled = true
      circleArray.forEach((el, i) => {
        if(el){
        newDest = document.createElementNS(
           "http://www.w3.org/2000/svg",
           "circle"
           )
          newDest.setAttribute("cx", `${el.x}`)
          newDest.setAttribute("cy", `${el.y}`)
          newDest.setAttribute("r", `8`)  
          newDest.setAttribute("fill", "#0060a9")
          // newDest.setAttribute("stroke", "#555")
          newDest.setAttribute("stroke-width", "0")
          newDest.classList.add("final-destination")
          svg.appendChild(newDest)
          if(el.id != undefined){
            if(i == e.id){
              e.disabled = true
            }
            if(i == s.id){
              s.disabled = true
            }
            if(i == r.id){
              r.disabled = false
            }
          }
        }
        })
      })
       })
      })
     }
    })
   
    //Call Editor Fx
    EditorFx()
   })
  }

  if(e.target.value == "FACILITIES"){

   circleArray = []
   mainPathArray = []
   
   apiArray = facilities

   isOpenRoom = false
   isMeetings =  false
   isFacilities = true
   isPeople = false

   if(input) document.querySelectorAll('.dname').forEach(e => e.remove())
   if(submit) document.querySelectorAll('.dsubmit').forEach(e => e.remove())
   if(reset) document.querySelectorAll('.dremove').forEach(e => e.remove())
   if(savePath) document.querySelectorAll('.save-path').forEach(e => e.remove())
   if(proceed) proceed.remove()
   document.querySelectorAll('.final-destination').forEach(e => e.remove())

   fetch(`${url}/paths/facility`)
   .then((response) => response.json())
   .then((data) => { 
    data.forEach(el => {
       mainPathArray = ([...el.data])
    })

   fetch(`${url}/destinations/facility`)
   .then((response) => response.json())
   .then((data) => { 
   data.forEach(el => {
     circleArray = [...el.data]
   })
   if(circleArray){
    document.querySelectorAll('.dsubmit').forEach(e => {
    document.querySelectorAll('.save-path').forEach(s => {
      document.querySelectorAll('.dremove').forEach(r => {
        r.disabled = true
    circleArray.forEach((el, i) => {
      if(el){
      newDest = document.createElementNS(
         "http://www.w3.org/2000/svg",
         "circle"
         )
        newDest.setAttribute("cx", `${el.x}`)
        newDest.setAttribute("cy", `${el.y}`)
        newDest.setAttribute("r", `8`)  
        newDest.setAttribute("fill", "#0060a9")
        // newDest.setAttribute("stroke", "#555")
        newDest.setAttribute("stroke-width", "0")
        newDest.classList.add("final-destination")
        svg.appendChild(newDest)
        if(el.id != undefined){
          if(i == e.id){
            e.disabled = true
          }
          if(i == s.id){
            s.disabled = true
         }
         if(i == r.id){
          r.disabled = false
        }
        }
      }
       })
      })
      })
     })
    }
   })

   //Call Editor FX
   EditorFx()
  })

  }
  if(e.target.value == "PEOPLE"){

    circleArray = []
    mainPathArray = []

    apiArray = people
    isOpenRoom = false
    isMeetings =  false
    isFacilities = false
    isPeople = true

    
    if(input) document.querySelectorAll('.dname').forEach(e => e.remove())
    if(submit) document.querySelectorAll('.dsubmit').forEach(e => e.remove())
    if(reset) document.querySelectorAll('.dremove').forEach(e => e.remove())
    if(savePath)document.querySelectorAll('.save-path').forEach(e => e.remove())
    if(proceed) proceed.remove()

    document.querySelectorAll('.final-destination').forEach(e => e.remove())
    
    fetch(`${url}/paths/people`)
   .then((response) => response.json())
   .then((data) => { 
    data.forEach(el => {
       mainPathArray = ([...el.data])
    })

    fetch(`${url}/destinations/people`)
   .then((response) => response.json())
   .then((data) => { 
    data.forEach(el => {
     circleArray = [...el.data]
    })

   if(circleArray){
    document.querySelectorAll('.dsubmit').forEach(e => {
    document.querySelectorAll('.save-path').forEach(s => {
      document.querySelectorAll('.dremove').forEach(r => {
        r.disabled = true
    circleArray.forEach((el, i) => {
      if(el){
      newDest = document.createElementNS(
         "http://www.w3.org/2000/svg",
         "circle"
         )
        newDest.setAttribute("cx", `${el.x}`)
        newDest.setAttribute("cy", `${el.y}`)
        newDest.setAttribute("r", `8`)  
        newDest.setAttribute("fill", "#0060a9")
        // newDest.setAttribute("stroke", "#555")
        newDest.setAttribute("stroke-width", "0")
        newDest.classList.add("final-destination")
        svg.appendChild(newDest)
        if(el.id != undefined){
          if(i == e.id){
            e.disabled = true
          }
          if(i == s.id){
            s.disabled = true
          }
          if(i == r.id){
            r.disabled = false
          }
         }
        }
      
      })
      })
    })
     })
    }
   })

    //Call Editor FX
    EditorFx()
  })
 }

}



function EditorFx(){

//PathFx

pathFx = function(roomId){

path = document.createElementNS("http://www.w3.org/2000/svg", "path")
path.classList.add("path")
path.setAttribute("d", d)
svg.appendChild(path)

gMainPoint = document.createElementNS("http://www.w3.org/2000/svg", "g")
gMainPoint.classList.add("main-point")

gInnerPoint = document.createElementNS("http://www.w3.org/2000/svg", "g")
gInnerPoint.classList.add("inner-point")

circlePoint = document.createElementNS("http://www.w3.org/2000/svg", "circle")
circlePoint.classList.add("point")

svg.appendChild(gMainPoint)
gMainPoint.appendChild(gInnerPoint)
gInnerPoint.appendChild(circlePoint)
circlePoint.setAttribute("cx", "260")
circlePoint.setAttribute("cy", "680")
circlePoint.setAttribute("r", "8")
circlePoint.setAttribute("fill", "#00E676")


circlePoint.onmousedown = function (event) {

  var gridX
  var gridY

  circlePoint.style.position = "absolute"
  circlePoint.style.zIndex = "1000"
  circlePoint.style.cursor = "pointer"
  
  moveAt(event.offsetX, event.offsetY)

  function moveAt(pageX, pageY) {

    gridX = round(Math.max(r, Math.min(width - r, pageX)), resolution)
    gridY = round(Math.max(r, Math.min(height - r, pageY)), resolution)

    circlePoint.setAttribute("cx", `${gridX}`)
    circlePoint.setAttribute("cy", `${gridY}`)
  }

  function onMouseMove(event) {
    if(event.ctrlKey){
    moveAt(event.offsetX, event.offsetY)
    }
  }

  function round(p, n) {
    return p % n < n / 2 ? p - (p % n) : p + n - (p % n);
  }

  document.addEventListener("mousemove", onMouseMove)

  if (event.ctrlKey) {    

    gInner1Point = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    )
    gInner1Point.classList.add("inner-point")

    gMainPoint.appendChild(gInner1Point)

    circle1Point = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    )

    circle1Point.classList.add("point")
    circle1Point.setAttribute("cx", `${gridX}`)
    circle1Point.setAttribute("cy", `${gridY}`)
    circle1Point.setAttribute("r", "8")
    circle1Point.style.fill = "#00E676"
    circle1Point.style.stroke = "#555"
    circle1Point.style.strokeWidth = "3px"
    gInner1Point.appendChild(circle1Point)

    if (d == undefined) {
      d = `M ${gridX} ${gridY}`
    }

    path.setAttribute("d", `${d} L ${gridX} ${gridY}`)
    d = `${d} L ${gridX} ${gridY}`

    pathEnd.push({roomiId:roomId, x:`${gridX}`, y:`${gridY}`})
    savePath.disabled = false 

  }

  circlePoint.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove)
    circlePoint.onmouseup = null
  }
}

circlePoint.ondragstart = function() {
  return false
}

}

pathFx(0)


//Proceed

proceed = document.createElement("button")
proceed.classList.add("proceed")
controlDown.appendChild(proceed)
proceed.textContent = "Save Floor"

if(!circleArray.length){
proceed.disabled = true
}
proceed.onclick = function(){

console.log("circle", circleArray)

console.log("main", mainPathArray)

if(isOpenRoom){
//Open Rooms Destination
fetch(`${url}/destinations/open-room`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': circleArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success');
  ViewFx(apiArray)
  })
  .catch((error) => {
   console.error('Error');
});

//Open Rooms Path
fetch(`${url}/paths/open-room`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': mainPathArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success')
  })
  .catch((error) => {
   console.error('Error')
});


}

if(isMeetings){

//Meetings
fetch(`${url}/destinations/meeting`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': circleArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success');
  ViewFx(apiArray)
  })
  .catch((error) => {
   console.error('Error');
});

//Meetings
fetch(`${url}/paths/meeting`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': mainPathArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success')
  })
  .catch((error) => {
   console.error('Error')
});

}


if(isFacilities){
//Facilities
fetch(`${url}/destinations/facility`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': circleArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success');
  ViewFx(apiArray)
  })
  .catch((error) => {
   console.error('Error');
});

//Facilities
fetch(`${url}/paths/facility`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': mainPathArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success')
  })
  .catch((error) => {
   console.error('Error')
});

}

if(isPeople) {
//People
fetch(`${url}/destinations/people`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': circleArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success');
  ViewFx(apiArray)
  })
  .catch((error) => {
   console.error('Error');
});

//People
fetch(`${url}/paths/people`, {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({'data': mainPathArray}),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success')
  })
  .catch((error) => {
   console.error('Error')
});

}

proceed.disabled = true
setTimeout(() => location.reload(), 500)

}


if(apiArray.length){

apiArray.forEach((el, i) => {

  input = document.createElement("input")
  input.classList.add("dname")
  input.setAttribute("type", "text")
  input.setAttribute("value", `${el.roomName}`)
  controlUpper.appendChild(input)
  
  input.disabled = true

  var countSubmit
  countSubmit = 0

  //Submit
  submit = document.createElement("button")
  submit.id = i
  submit.classList.add("dsubmit", "destination")
  submit.textContent = "Mark Destination"
  controlUpper.appendChild(submit)
  // document.querySelectorAll('.dsubmit').forEach(e => {
  //   e.id = countSubmit
  //   countSubmit++
  // })
  
  submit.onclick = function(e){

    proceed.disabled = true

    if(i == e.target.id){
        e.target.disabled = true
    }

    control.style.pointerEvents = "none"
    control.style.cursor = "not-allowed"
    editor.style.pointerEvents = "all"
    editor.style.cursor = "auto"

    destPoint = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    )
  
    svg.appendChild(destPoint)
    destPoint.classList.add("dest-point")
    destPoint.setAttribute("fill", "#0060a9")
    destPoint.setAttribute("stroke", "#4e97c4")
    destPoint.setAttribute("stroke-width", 4)
    destPoint.setAttribute("cx", "600")
    destPoint.setAttribute("cy", "710")
    destPoint.setAttribute("r", "8")
    destPoint.setAttribute("id", `${counter}`)

    finalDest = destPoint.cloneNode(true)

    destPoint.onmousedown = function (event) {
    
      destPoint.style.position = "absolute"
      destPoint.style.zIndex = "1000"
      destPoint.style.cursor = "pointer"
    
      moveAt(event.offsetX, event.offsetY)
    
      var circlePOSX
      var circlePOSY
    
      function moveAt(pageX, pageY) {

        circlePOSX = pageX
        circlePOSY = pageY
    
        destPoint.setAttribute("cx", `${pageX}`)
        destPoint.setAttribute("cy", `${pageY}`)

        control.style.pointerEvents = "all"
        control.style.cursor = "auto"
      }
      
      function onMouseMove(event) {
        moveAt(event.offsetX, event.offsetY)
      }
      
      document.addEventListener("mousemove", onMouseMove)
      
      destPoint.onmouseup = function () {
        
        let innetHTML
        
        if(el.statusName == "AVAILABLE"){
        innetHTML = `<div style="display:block; background:green;padding:10px;">
        <h3 style="color:#fff;text-align:center;"><i class="fa fa-check-circle" style="color:#fff;"></i>&nbsp;${el.roomName}</h3>
      </div>
      <div style="display:block; padding:10px;">
        <p style="padding-bottom: 10px;">NEXT MEETING</p>
        <p style="font-size:20px;">3:00PM - 4:30PM</pstyle>
        <p>Assin, Sharon</p>
      </div>`
        }
        if(el.statusName == "OCCUPIED"){
        innetHTML = `<div style="display:block; background:red;padding:10px;">
        <h3 style="color:#fff;text-align:center;"><i class="fa fa-times-circle" style="color:#fff;"></i>&nbsp;${el.roomName}</h3>
      </div>
      <div style="display:block; padding:10px;">
        <p style="padding-bottom: 10px;">CURRENT MEETING</p>
        <p style="font-size:20px;">12:45PM - 1:30PM</pstyle>
        <p>Sahar, Onen</p>
      </div>`
        }

        circleArray[e.target.id] = {id:el.roomId, x: circlePOSX, y: circlePOSY, textValue:el.roomName, innerHTML:innetHTML, statusName:el.statusName}

        finalDest = destPoint.cloneNode(true)
        destPoint.parentNode.replaceChild(finalDest, destPoint)
        document.removeEventListener("mousemove", onMouseMove)
        destPoint.onmouseup = null
      }
    }
    
    destPoint.ondragstart = function () {
      return false
    }
  }


  var countPath
  countPath = 0

  savePath = document.createElement("button")
  savePath.classList.add("save-path", "destination")
  savePath.textContent = "Save Path"
  controlUpper.appendChild(savePath)

  savePath.id = i
  // document.querySelectorAll('.save-path').forEach(e => {
  //   e.id = countPath
  //   countPath++
  // })

  var countSave
  countSave = 0
  savePath.onclick = function(e){

    if(i == e.target.id) e.target.disabled = true

    document.querySelectorAll('.dremove').forEach(r => { 
      console.log(r.id)
      if(r.id == e.target.id) r.disabled = false
    })

    mainPathArray[e.target.id] = pathEnd
    
    finalDest.setAttribute("fill", "#0060a9")
    finalDest.setAttribute("stroke-width", "0")
    destPoint.setAttribute("fill", "#0060a9")
    destPoint.setAttribute("stroke-width", "0")
    gMainPoint.remove()
    path.remove()
    d = undefined
    pathFx(e.target.id)
    svg.appendChild(gMainPoint)
    gMainPoint.appendChild(gInnerPoint)
    gInnerPoint.appendChild(circlePoint)
    // mainPathArray.push(pathEnd)
    apiArray[countSave].isPath = true
    countSave++
    pathEnd = []
    proceed.disabled = false
    editor.style.pointerEvents = "none"
  }

  var countReset
  countReset = 0

  reset = document.createElement("button")
  reset.classList.add("dremove", "reset")
  reset.id = i
  // document.querySelectorAll('.dremove').forEach(e => {
  //   console.log(e)
  //   e.id = countReset
  //   countReset++
  // })
  reset.textContent = "Reset"
  controlUpper.appendChild(reset)

  reset.onclick = function(e){
    mainPathArray[e.target.id] = []
    circleArray[e.target.id] = null

    console.log("circ", circleArray)
    console.log("maii", mainPathArray)
    
    console.log(e.target.id)
    proceed.disabled = false
    document.querySelectorAll('.dremove').forEach(d => {
      if(d.id == e.target.id) d.disabled = true
    })
    document.querySelectorAll('.dsubmit').forEach(d => {
      if(d.id == e.target.id) d.disabled = false
    })
    document.querySelectorAll('.save-path').forEach(s => {
      if(e.target.id == s.id) s.disabled = false
    })
  }

  // circleArray.forEach((el) => {
  //   newDest = document.createElementNS(
  //      "http://www.w3.org/2000/svg",
  //      "circle"
  //      )
  //     newDest.setAttribute("cx", `${el.x}`)
  //     newDest.setAttribute("cy", `${el.y}`)
  //     newDest.setAttribute("r", `8`)  
  //     newDest.setAttribute("fill", "#0060a9")
  //     // newDest.setAttribute("stroke", "#555")
  //     newDest.setAttribute("stroke-width", "0")
  //     svg.appendChild(newDest)
    
  //     if(el.id != undefined){
  //       if(el.id == submit.id){
  //         submit.disabled = true
  //         savePath.disabled = true
  //       }
  //     }
  //   })
  })
 }

}

