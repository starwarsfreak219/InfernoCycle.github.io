import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

const client = axios.create({
  baseURL:"https://infernovertigo.pythonanywhere.com"
})

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

function Leaderboard(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [board, setBoard] = useState([]);
  
  const changePage = (e, isButton=false, buttons=[]) =>{
    if(!isButton){
      if(e.target.text == undefined){
        return;
      }
      navigate(`/leaderboard/${e.target.text}`);
    }else{
      if(buttons[0].textContent.toLowerCase() == "prev"){
        navigate(`/leaderboard/${e-1}`)
        return;
      }
      if(buttons[0].textContent.toLowerCase() == "next"){
        navigate(`/leaderboard/${e+1}`)
        return;
      }else{
        navigate(`/leaderboard/1`)
      }
    }
  }

  function sort(list=[], idx=0) {
    let arr = []
    // Break out of loop if any one of the array gets empty
    for(let i = 1; i < list.length; i++){
      for(let k = 0; k<i;k++){
        if(idx == 1){
          if(list[i][idx] > list[k][idx]){
            let temp = list[i];
            list[i] = list[k];
            list[k] = temp;
          }
        }else{
          if(list[i][idx].toLowerCase() < list[k][idx].toLowerCase()){
            let temp = list[i];
            list[i] = list[k];
            list[k] = temp;
          }
        }
      }
    }
  }

  function sortBy(list, option, idx=0){
    //now sort by how user wants it
    if(option === "completed"){
      return sort(list, idx)
    }
  }

  function binary_search(list=[], val, isMulti=false, idx=0){
    let lowerbound = 0;
    let upperbound = list.length-1;

    if(!isMulti){
      while(lowerbound <= upperbound){
        let mid = Math.floor(lowerbound + (upperbound - lowerbound) / 2);
  
        if(list[mid] == val){
          return mid;
        }
  
        else if(list[mid] < val){
          lowerbound = mid + 1;
        }
  
        else{
          upperbound = mid - 1
        }
      }
    }
    else if(isMulti){
      while(lowerbound <= upperbound){
        let mid = Math.floor((upperbound + lowerbound) / 2);
  
        if(list[mid][idx] == val){
          return mid;
        }
  
        else if(list[mid][idx] < val){
          lowerbound = mid + 1;
        }
  
        else{
          upperbound = mid - 1
        }
      }
    }
    
    return -1;
  }

  function linearSearch(list, val){
    let front = 0;
    let back = list.length -1

    while (front <= back){
      if(list[front][0] == val){
        return front;
      }
      if(list[back][0] == val){
        return back;
      }
      front += 1;
      back -= 1;
    }
  }

  useEffect(()=>{
    //console.log("a change in url occurred")
    async function runBoard(){
      const table = document.getElementById("leaderboard_table");
      const rows = document.getElementsByClassName("removable");

      for(let i = rows.length-1; i>-1; i--){
        rows[i].remove();
      }

      document.getElementById("redirect_cont").style.display="table-cell";

      const leaders = await client.get("users/leaderboard",{
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        return res.data;
      })

      setBoard((obj)=>{
        return [...obj, leaders["users"]]
      })

      const users = leaders["users"];

      //console.log(users)
      //const seperatePages = Math.ceil(users.length/100);

      const setUp = window.location.href.split("/");
      const page = setUp[setUp.length-1];

      let limit = 100 * Number(page);
      let startAt = limit - 100;

      /*let someList = []
      for(let i=0; i<201; i++){
        someList.push(["test", 0 + (Math.random() * 100)])
      }*/
      sortBy(users, "completed", 1);
      //console.log(sortedList);

      const maxPages = Math.ceil(users.length/100);
      const pageScroll = document.getElementsByClassName("page_scroll");
      //console.log(maxPages)
      if(Number(page) > maxPages){
        navigate(`leaderboard/${maxPages}`)
      }
      let count = 0;
      if(Number(page) == 1){
        pageScroll[0].innerHTML="<div class='select_cont'>"+/*"<a class='selectedPage'>1</a>"+
        "<a>2</a>"+
        "<a>3</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"+*/
        "</div>";
        
        pageScroll[1].innerHTML="<div class='select_cont'>"/*+
        "<a class='selectedPage'>1</a>"+
        "<a>2</a>"+
        "<a>3</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+
        "</div>";

        //Cleanup
        const select_cont = document.getElementsByClassName("select_cont");
        //console.log(select_cont[0]);
        
        for(let i=1; i<=maxPages; i++){
          const anchor = document.createElement("a");
          if(page == i){
            anchor.setAttribute("class","selectedPage");
          }
          anchor.appendChild(document.createTextNode(i.toString()));
          select_cont[0].appendChild(anchor);
          count++;
          if(i == Number(page)+2){
            break;
          }
        }
        //console.log(maxPages)
        if(count < maxPages){
          const span = document.createElement("span");
          span.appendChild(document.createTextNode("..."));
          select_cont[0].appendChild(span);
          count = 0;
          const anchor = document.createElement("a");
          anchor.appendChild(document.createTextNode(maxPages.toString()))
          select_cont[0].appendChild(anchor);

          /*edit this stuff per page requirement*/
          /*const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);*/
        }
        if(maxPages>1){
          const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);
        }
        /*if(){

        }*/
        //select_cont[0].appendChild(anchor)
        select_cont[1].innerHTML = select_cont[0].innerHTML;

        if(maxPages>=page){
          
        }else{
          navigate("/leaderboard/1");
        }
        pageScroll[1].innerHTML = pageScroll[0].innerHTML;
      }

      if(Number(page) == 2){
        pageScroll[0].innerHTML="<div class='select_cont'>" /*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a class='selectedPage'>2</a>"+
        "<a>3</a>"+
        "<a>4</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+
        "</div>";

        pageScroll[1].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a class='selectedPage'>2</a>"+
        "<a>3</a>"+
        "<a>4</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+
        "</div>";

        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("class", "changeBtns");
        prevBtn.appendChild(document.createTextNode("Prev"));
        const select_cont = document.getElementsByClassName("select_cont");
        select_cont[0].appendChild(prevBtn);
        
        for(let i=1; i<=maxPages; i++){
          const anchor = document.createElement("a");
          if(page == i){
            anchor.setAttribute("class","selectedPage");
          }
          anchor.appendChild(document.createTextNode(i.toString()));
          select_cont[0].appendChild(anchor);
          count++;
          if(i == Number(page)+2){
            break;
          }
        }
        if(count < maxPages){
          const span = document.createElement("span");
          span.appendChild(document.createTextNode("..."));
          select_cont[0].appendChild(span);
          count = 0;
          const anchor = document.createElement("a");
          anchor.appendChild(document.createTextNode(maxPages.toString()))
          select_cont[0].appendChild(anchor);

          /*edit this stuff per page requirement*/
          const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);
        }
        /*if(){

        }*/
        //select_cont[0].appendChild(anchor)

        if(maxPages>=page){
          
        }else{
          navigate("/leaderboard/1");
        }
        pageScroll[1].innerHTML = pageScroll[0].innerHTML;
      }
      if(Number(page) == 3){
        if(Number(page)>maxPages){
          navigate(`/leaderboard/${maxPages}`);
        }
        pageScroll[0].innerHTML="<div class='select_cont'>"+/*
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a>2</a>"+
        "<a class='selectedPage'>3</a>"+
        "<a>4</a>"+
        "<a>5</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/"</div>";

        pageScroll[1].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a>2</a>"+
        "<a class='selectedPage'>3</a>"+
        "<a>4</a>"+
        "<a>5</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+"</div>";

        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("class", "changeBtns");
        prevBtn.appendChild(document.createTextNode("Prev"));
        const select_cont = document.getElementsByClassName("select_cont");
        select_cont[0].appendChild(prevBtn);

        for(let i=1; i<=maxPages; i++){
          const anchor = document.createElement("a");
          if(page == i){
            anchor.setAttribute("class","selectedPage");
          }
          anchor.appendChild(document.createTextNode(i.toString()));
          select_cont[0].appendChild(anchor);
          count++;
          if(i == Number(page)+3){
            break;
          }
        }
        if(count < maxPages){
          const span = document.createElement("span");
          span.appendChild(document.createTextNode("..."));
          select_cont[0].appendChild(span);
          count = 0;
          const anchor = document.createElement("a");
          anchor.appendChild(document.createTextNode(maxPages.toString()))
          select_cont[0].appendChild(anchor);

          /*edit this stuff per page requirement*/
          /*const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);*/
        }
        if(maxPages>3){
          const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);
        }
        pageScroll[1].innerHTML = pageScroll[0].innerHTML;
      }
      if(Number(page) == 4){
        if(Number(page)>maxPages){
          navigate(`/leaderboard/${maxPages}`);
        }
        pageScroll[0].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a>2</a>"+
        "<a>3</a>"+
        "<a class='selectedPage'>4</a>"+
        "<a>5</a>"+
        "<a>6</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+"</div>";

        pageScroll[1].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<a>2</a>"+
        "<a>3</a>"+
        "<a class='selectedPage'>4</a>"+
        "<a>5</a>"+
        "<a>6</a>"+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+"</div>";

        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("class", "changeBtns");
        prevBtn.appendChild(document.createTextNode("Prev"));
        const select_cont = document.getElementsByClassName("select_cont");
        select_cont[0].appendChild(prevBtn);

        for(let i=1; i<=maxPages; i++){
          const anchor = document.createElement("a");
          if(page == i){
            anchor.setAttribute("class","selectedPage");
          }
          anchor.appendChild(document.createTextNode(i.toString()));
          select_cont[0].appendChild(anchor);
          count++;
          if(i == Number(page)+3){
            break;
          }
        }
        if(count < maxPages){
          const span = document.createElement("span");
          span.appendChild(document.createTextNode("..."));
          select_cont[0].appendChild(span);
          count = 0;
          const anchor = document.createElement("a");
          anchor.appendChild(document.createTextNode(maxPages.toString()))
          select_cont[0].appendChild(anchor);

          /*edit this stuff per page requirement*/
          /*const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);*/
        }
        if(maxPages>4){
          const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);
        }
        pageScroll[1].innerHTML = pageScroll[0].innerHTML;
      }
      if(Number(page) > 4){
        if(Number(page)>maxPages){
          navigate(`/leaderboard/${maxPages}`);
        }
        pageScroll[0].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<span>...</span>"+
        `<a>${Number(page)-2}</a>`+
        `<a>${Number(page)-1}</a>`+
        `<a class="selectedPage">${Number(page)}</a>`+
        `<a>${Number(page)+1}</a>`+
        `<a>${Number(page)+2}</a>`+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+"<div>";

        pageScroll[1].innerHTML="<div class='select_cont'>"/*+
        "<button class='changeBtns'>Prev</button>" +
        "<a>1</a>"+
        "<span>...</span>"+
        `<a>${Number(page)-2}</a>`+
        `<a>${Number(page)-1}</a>`+
        `<a class="selectedPage">${Number(page)}</a>`+
        `<a>${Number(page)+1}</a>`+
        `<a>${Number(page)+2}</a>`+
        "<span>...</span>"+
        `<a>${maxPages}</a>`+
        "<button class='changeBtns'>Next</button>"*/+"</div>";

        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("class", "changeBtns");
        prevBtn.appendChild(document.createTextNode("Prev"));
        const select_cont = document.getElementsByClassName("select_cont");
        select_cont[0].appendChild(prevBtn);

        const first = document.createElement("a");
        first.appendChild(document.createTextNode(1));

        const spanBefore = document.createElement("span");
        spanBefore.appendChild(document.createTextNode("..."));
        
        select_cont[0].appendChild(first);
        select_cont[0].appendChild(spanBefore);

        let addThis = 2;
        for(let i=page-2; i<=maxPages; i++){
          const anchor = document.createElement("a");
          if(i == Number(page)){
            anchor.setAttribute("class","selectedPage");
          }
          anchor.appendChild(document.createTextNode((Number(page)-addThis).toString()));
          select_cont[0].appendChild(anchor);
          count++;
          addThis -= 1;
          if(i == Number(page)+2){
            break;
          }
        }
        if(maxPages - Number(page) < 3){

        }else{
          if(count < maxPages){
            const span = document.createElement("span");
            span.appendChild(document.createTextNode("..."));
            select_cont[0].appendChild(span);
            count = 0;
            const anchor = document.createElement("a");
            anchor.appendChild(document.createTextNode(maxPages.toString()))
            select_cont[0].appendChild(anchor);
  
            /*edit this stuff per page requirement*/
            /*const prevBtn2 = document.createElement("button");
            prevBtn2.setAttribute("class", "changeBtns");
            prevBtn2.appendChild(document.createTextNode("Next"));
            select_cont[0].appendChild(prevBtn2);*/
          }
        }
        
        if(maxPages>Number(page)){
          const prevBtn2 = document.createElement("button");
          prevBtn2.setAttribute("class", "changeBtns");
          prevBtn2.appendChild(document.createTextNode("Next"));
          select_cont[0].appendChild(prevBtn2);
        }

        pageScroll[1].innerHTML = pageScroll[0].innerHTML;
      }

      for(let a =0; a < pageScroll[0].children.length; a++){
        pageScroll[0].children[a].addEventListener("click", (e)=>{
          changePage(e);
        })
        pageScroll[1].children[a].addEventListener("click", (e)=>{
          changePage(e);
        })
      }

      const topButtons = pageScroll[0].getElementsByClassName("changeBtns");
      const bottomButtons = pageScroll[1].getElementsByClassName("changeBtns");
      
      for(let a = 0; a<topButtons.length;a++){
        topButtons[a].addEventListener("click",()=>{
          changePage(Number(page), true, [topButtons[a]])
        })
        bottomButtons[a].addEventListener("click",()=>{
          changePage(Number(page), true, [bottomButtons[a]])
        })
      }
      //console.log(localStorage.getItem("user"))
      //const User_rank = binary_search(yourUser, localStorage.getItem("user"), true);
      const User_rank = linearSearch(users, localStorage.getItem("user"));

      const stuff = document.getElementById("usr_rank");
      stuff.innerText = User_rank + 1;

      users.map((obj, idx)=>{
        if(idx == limit){
          //console.log(`limit of ${limit} reached.`)
          return;
        }
        if(idx >= startAt && idx < limit){
          const tr = document.createElement("tr");
          const td0 = document.createElement("td")
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");

          if(idx == 0){
            tr.setAttribute("id", "firstPlace");
            tr.setAttribute("class", "removable");
          }
          if(idx == 1){
            tr.setAttribute("id", "secondPlace");
            tr.setAttribute("class", "removable");
          }
          if(idx == 2){
            tr.setAttribute("id", "thirdPlace");
            tr.setAttribute("class", "removable");
          }
          if(idx > 2){
            tr.setAttribute("class", "subRows removable");
          }

          let rank = document.createTextNode((idx + 1).toString())
          let textUser = document.createTextNode(obj[0]);
          let tournieUser = document.createTextNode(obj[1]);

          if(User_rank != -1){
            if(User_rank == idx){
              td0.setAttribute("id", "your_person")
              td0.appendChild(document.createTextNode("You"))
            }else{
              td0.appendChild(rank);
            }
          }else{
            td0.appendChild(rank);
          }

          td1.appendChild(textUser);
          td2.appendChild(tournieUser);

          tr.appendChild(td0);
          tr.appendChild(td1);
          tr.appendChild(td2);

          table.appendChild(tr);
        }
      });

      document.getElementById("redirect_cont").style.display="none";
    }
    runBoard();
  },[window.location.href])

  /*useEffect(()=>{
    if(props.redirectTo == "home"){
      navigate("/");
    }
    if(props.redirectTo == "about"){
      navigate("/about");
    }
    if(props.redirectTo == "queue"){
      navigate("/mal_queue");
    }
    if(props.redirectTo == "stats"){
      navigate("/stats");
    }
    if(props.redirectTo == "season"){
      navigate("/about");
    }
    if(props.redirectTo == "queue_in"){
      navigate("/queue_in");
    }
    if(props.redirectTo == "login"){
      navigate("/login");
    }
    if(props.redirectTo == "register"){
      navigate("/register");
    }
    if(props.redirectTo == "anime"){
      navigate("/anime");
    }
  })*/
  return (
    <div>
      <nav className="page_scroll"></nav>
      <h1 id="table_title">Leaderboard {"(Beta)"}</h1>
      <h4 id="usr_rank_cont">Your Rank: <span id="usr_rank">Loading Rank</span></h4>
      <div id="table_cont">
        <table id="leaderboard_table">
          <tr id="table_leaderboard_head1">
            <th>Rank #</th>
            <th>Username</th>
            <th>Completed</th>
          </tr>
          <td colSpan={3} id="redirect_cont">
            <div class="loader"></div>
            <span id="loading_id">LOADING LEADERBOARD</span>
          </td>
        </table>
      </div>
      <nav className="page_scroll"></nav>
    </div>
  )
}

export default Leaderboard