// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
'use strict';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Col, Row , Container} from 'react-bootstrap';
import './index.css';

const SIZE = 45; // size of the grid
const REFRESH_INTERVAL = 200; // refresh interval in ms
const WIDTH_COEFFICIENT = 14; // width coefficient for the grid
let runs = null; // number of runs
let flag = false; // flag for the existence of the life


// ===== Fundamental Data Structures =====
  // Cell Data Structure
class Cell {
  x;
  y;
  
  neighbors = [];
  isNowLive;
  willBeLive;
 
  constructor(inX, inY) {
      this.x = inX;
      this.y = inY;
      this.isNowLive = false;
      this.neighbors = [this, this, this, this, 
        this, this, this,this]; // {left_top,top,right_top,left,right,left_bottom,bottom,right_bottom}
  }
  getX() {
      return this.x;
  }

  getY() {
      return this.y;
  }
  
  isLive() {
      return this.isNowLive;
  }

  equal(other) {
      return ((this.getX() == other.getX()) && (this.getY() == other.getY()));
  }
 
  setLeft(inCell) {
    this.neighbors[3] = inCell;
  }
  setRight(inCell) {
    this.neighbors[4] = inCell;
  }
  setTop(inCell) {
    this.neighbors[1] = inCell;
  }
  setBottom(inCell) {
    this.neighbors[6] = inCell;
  }
  setLeftTop(inCell) {
    this.neighbors[0] = inCell;
  }
  setRightTop(inCell) {
    this.neighbors[2] = inCell;
  }
  setLeftBottom(inCell) {
    this.neighbors[5] = inCell;
  }
  setRightBottom(inCell) {
    this.neighbors[7] = inCell;
  }
 
  setBorn() {
    this.willBeLive = true;
  }
  setDie() {
      this.willBeLive = false;
  }

  getCountLiveNeighbors() {
      let count = 0;
      for (let i = 0;i<8;i++) {
        let c = this.neighbors[i];
        if (c!=null && c.isNowLive && !c.equal(this)) {count++;}
      }
      return count;
  }
 
  setNextLife() {
      let numLiveNeighbors = this.getCountLiveNeighbors();
      if (numLiveNeighbors<2 || numLiveNeighbors>3) {
          this.setDie();
      }
      else if (numLiveNeighbors == 3) {
          this.setBorn();
      }
  }

  refreshNextLive() {
      this.isNowLive = this.willBeLive;
  }
} 

  // Cell World Data Structure
class CellWorld {
  width; // w
  height; // h

  heightBound; // h

  widthBound; // w
  cells = []; // [h][w]

  constructor(inH, inW) {
     this.height = inH;
     this.width = inW;
     this.heightBound = this.height+2;
     this.widthBound = this.width+2;
     for (let i=0;i<this.heightBound;i++) {
       this.cells[i] = new Array();
         for (let j=0;j<this.widthBound;j++) {
            this.cells[i][j] = new Cell(j,i);
         }
     }
     for (let i=1;i<this.height+1;i++) {
         for (let j=1;j<this.width+1;j++) {
           this.connectToNeighbors(this.cells[i][j]);
         }
     }
  }

  connectToNeighbors(inCell) {
      inCell.setLeft(this.cells[inCell.getY()][inCell.getX()-1]);
      inCell.setRight(this.cells[inCell.getY()][inCell.getX()+1]);

      inCell.setTop(this.cells[inCell.getY()-1][inCell.getX()]);
      inCell.setBottom(this.cells[inCell.getY()+1][inCell.getX()]);

      inCell.setLeftTop(this.cells[inCell.getY() - 1][inCell.getX() - 1]);
      inCell.setRightTop(this.cells[inCell.getY() - 1][inCell.getX() + 1]);

      inCell.setLeftBottom(this.cells[inCell.getY() + 1][inCell.getX() - 1]);
      inCell.setRightBottom(this.cells[inCell.getY() + 1][inCell.getX() + 1]);
  }

  getCell(inI) {
    let inX = Math.floor(inI/SIZE);
    let inY = inI%SIZE;
    return this.cells[inX+1][inY+1];
  }

  add(inCell) {
    this.cells[inCell.getY()+1][inCell.getX()+1].setBorn();
    this.cells[inCell.getY()+1][inCell.getX()+1].refreshNextLive();
  }

  reverse(inCell) {
    if (inCell.isLive()) {
      inCell.setDie();
    }
    else {
      inCell.setBorn();
    }
    inCell.refreshNextLive();
  }

  refresh() {
      for (let i=1;i<this.height+1;i++) {
          for (let j=1;j<this.width+1;j++) {
              this.cells[i][j].setNextLife();
          }
      }
      for (let i=1;i<this.height+1;i++) {
          for (let j=1;j<this.width+1;j++) {
            this.cells[i][j].refreshNextLive();
          }
      }
  }

  resetWorld() {
    for (let i=1;i<this.height+1;i++) {
        for (let j=1;j<this.width+1;j++) {
          this.cells[i][j].setDie();
          this.cells[i][j].refreshNextLive();
        }
    }
  }

  listAll() {
  let out=[];
      for (let i=1;i<this.height+1;i++) {
          for (let j=1;j<this.width+1;j++) {
              if (this.cells[i][j].isLive()) {
                out.push(true);
              }
              else {
                out.push(false);
              }
          }
      }
  return out;
  }

  getLiveNum() {
    let count = 0;
    for (let i=1;i<this.height+1;i++) {
        for (let j=1;j<this.width+1;j++) {
            if (this.cells[i][j].isLive()) {
              count++;
            }
        }
    }
    return count;
  }
}
// ===== End of Fundamental Data Structures =====


// ===== Frontend Components =====
  // Square for Cell
class Square extends React.Component{

  setCheck() {
    this.setState({checked: !this.state.checked});
  }

  setUnCheck() {
    this.setState({checked: !this.state.checked});
  }

  render() {
    return (
      <button className = "square"
              onClick={() => this.props.onClick()}
              style={{background: this.props.checked? "#000":"#fff"}}>
                {/* {this.props.value} */}
      </button>
    );
  }

}
  // Board for Cell World
class Board extends React.Component {
  time = 0;
  
  constructor(props) {
    super(props);
    this.state = {
      theWorld : new CellWorld(SIZE,SIZE),
      squares: Array(SIZE*SIZE).fill(false),
      
    };
  }  
  
  start() {
    if (this.state.theWorld.getLiveNum() == 0) {
      flag = false;
      clearInterval(runs);
      return;
    }
    flag = true;
    clearInterval(runs);
    runs = setInterval(() => this.refreshBoard(), REFRESH_INTERVAL);
  }

  refreshBoard() {
    if (this.state.theWorld.getLiveNum() == 0) {
      this.stop();
      return;
    }
    if (flag == false) { 
      clearInterval(runs);
      return;
    }
    document.getElementById("startBtn").style.backgroundColor = "#00FF00";
    document.getElementById("stopBtn").style.backgroundColor = "#fff";
    this.state.theWorld.refresh();
    this.setState({squares: this.state.theWorld.listAll()});
    this.time += 1;
    this.updateData();
  }

  stop() {
    flag = false;
    clearInterval(runs);
    document.getElementById("startBtn").style.backgroundColor = "#fff";
    document.getElementById("stopBtn").style.backgroundColor = "#f00";
  }

  reset() {
    this.time=0
    this.stop();
    this.state.theWorld.resetWorld();
    this.setState({squares: this.state.theWorld.listAll()});
    document.getElementById("startBtn").style.backgroundColor = "#fff";
    document.getElementById("stopBtn").style.backgroundColor = "#fff";

    document.getElementById("lifeA").style.backgroundColor = "#fff";
    document.getElementById("lifeB").style.backgroundColor = "#fff";
    document.getElementById("theWorld").style.backgroundColor = "#fff";
    this.updateData();
  }

  updateData() {
    document.getElementById("timeData").innerHTML = "时间 | Time: "+(this.time/5).toFixed(0)+"s";
    document.getElementById("amountData").innerHTML = "数量 | Lives: "+this.state.theWorld.getLiveNum();
  }

  lifeA () {
    this.reset();

    document.getElementById("lifeA").style.backgroundColor = "#ddd";
    document.getElementById("lifeB").style.backgroundColor = "#fff";
    document.getElementById("theWorld").style.backgroundColor = "#fff";

    this.handleClick(22*SIZE+9);
    this.handleClick(22*SIZE+10);
    this.handleClick(22*SIZE+11);
    this.handleClick(22*SIZE+12);
    this.handleClick(22*SIZE+13);
    this.handleClick(22*SIZE+14);
  }

  lifeB() {
    this.reset();

    document.getElementById("lifeA").style.backgroundColor = "#fff";
    document.getElementById("lifeB").style.backgroundColor = "#ddd";
    document.getElementById("theWorld").style.backgroundColor = "#fff";

    this.handleClick(4*SIZE+3);
    this.handleClick(5*SIZE+4);
    this.handleClick(5*SIZE+5);
    this.handleClick(4*SIZE+5);
    this.handleClick(3*SIZE+5);

  }

  world() {
    this.reset();

    document.getElementById("lifeA").style.backgroundColor = "#fff";
    document.getElementById("lifeB").style.backgroundColor = "#fff";
    document.getElementById("theWorld").style.backgroundColor = "#ddd";

    this.handleClick(8*SIZE+3);
    this.handleClick(10*SIZE+3);
    this.handleClick(11*SIZE+4);
    this.handleClick(11*SIZE+5);
    this.handleClick(11*SIZE+6);
    this.handleClick(11*SIZE+7);
    this.handleClick(10*SIZE+7);
    this.handleClick(9*SIZE+7);
    this.handleClick(8*SIZE+6);

    this.handleClick(31*SIZE+41);
    this.handleClick(33*SIZE+41);
    this.handleClick(34*SIZE+40);
    this.handleClick(34*SIZE+39);
    this.handleClick(34*SIZE+38);
    this.handleClick(34*SIZE+37);
    this.handleClick(33*SIZE+37);
    this.handleClick(32*SIZE+37);
    this.handleClick(31*SIZE+38);

    this.handleClick(3*SIZE+41);
    this.handleClick(4*SIZE+40);
    this.handleClick(4*SIZE+39);
    this.handleClick(3*SIZE+39);
    this.handleClick(2*SIZE+39);

    this.handleClick(3+41*SIZE);
    this.handleClick(4+40*SIZE);
    this.handleClick(4+39*SIZE);
    this.handleClick(3+39*SIZE);
    this.handleClick(2+39*SIZE);

    for (let i=0;i<8;i++) { 
      this.handleClick(22*SIZE+(3+i));
    }
    for (let i=0;i<8;i++) { 
      this.handleClick(22*SIZE+(33+i));
    }

    for (let i=0;i<8;i++) { 
      this.handleClick((3+i)*SIZE+22);
    }

    for (let i=0;i<8;i++) { 
      this.handleClick((33+i)*SIZE+22);
    }

  }


  handleClick(i) {
    let inX = Math.floor(i/SIZE);
    let inY = i%SIZE;
    // console.log(inX,inY);
    let newCell = this.state.theWorld.getCell(i);
    // console.log(newCell.isLive());
    this.state.theWorld.reverse(newCell);
    // console.log(this.state.theWorld.getCell(i).isLive());
    this.setState({squares: this.state.theWorld.listAll()});
    this.updateData();
  }

  renderSquare(i) {
    return (
      <Square
        value = {this.state.squares[i]? "X":"O"}
        checked={(this.state.squares[i])}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  createSquares() {
    let rows = [];
    for(let p = 0; p < SIZE; p++){
      let squares = [];
      for(let q = 0; q < SIZE; q++){
        squares.push(this.renderSquare(SIZE*p+q));
      }
      rows.push(<div className="board-row" style={{width:(SIZE)*WIDTH_COEFFICIENT+"px"}}>{squares}</div>);
    }
    return rows;
  }
  
  render() {  
    return (
      <center>
      <Row className="justify-content-center" style={{alignContent: "center", height: "60%"}}>
            <Col xs={12} md={6} className="justify-content-center">

              <button id="lifeA" className="btn"  onClick={() => this.lifeA()}>生命甲 | Life A</button>
              <button id="lifeB" className="btn"  onClick={() => this.lifeB()}>生命乙 | Life B</button>
              <button id="theWorld" className="btn"  onClick={() => this.world()}>世界 | The World</button>
              <button id="custom" className="btn"  onClick={() => this.reset()}>自定 | Custom</button>
              <br></br>
              <button id="startBtn" className="btn2" onClick={() => this.start()}><b>开始 | Start</b></button>
              
              <button id="stopBtn" className="btn2" onClick={() => this.stop()}><b>暂停 | Stop</b></button>
              
              <button className="btn2" onClick={() => this.reset()}><b>清空 | Clear</b></button>
              <br></br>
              <label id="amountData" className="lb">数量 | Lives: 0</label>
              
              <label id="timeData" className="lb">时间 | Time: 0s</label>
          </Col>
      </Row>

      <div className="board" style={{width:(SIZE)*WIDTH_COEFFICIENT+"px"}}>
        {this.createSquares()}
      </div>

      </center>
    );
  }
}
// ===== End of Frontend Components =====


// ===== Frontend Layout =====
const root = ReactDOM.createRoot(document.getElementById("root")).render(
    <Container fluid style={{backgroundColor: "#ffffff", padding: "0px", margin:"0px"}}>  
      <Row className="justify-content-center" style={{alignContent: "center", height: "80%"}}>
        <h3 style={{width: "100%", textAlign: "center", marginTop: "10px", color: "#000000"}}><b>康威生命游戏 | Conway's Game of Life</b></h3>
        
        <center>
          <font size="2" >请先阅读下方的<b>使用说明</b> | Please read the <b>Instructions</b> below first</font>
        </center>
      </Row>

      <Row className="justify-content-center" style={{alignContent: "center", height: "60%"}}>
          <Col xs={6} md={6} className="justify-content-center">
              
              <div id="bi_iframe" style={{alignContent:"left" ,transformOrigin: "0 top 0", margin:"10px"}}>
              <Board />
              </div>
              
          </Col>
      </Row>

      <br></br>
        
      <Row className="justify-content-center" style={{alignContent: "center", height: "60%"}}>
        <Col xs={12} sm={6} md={6} className="justify-content-center" width="80%">
        <h2 style={{width: "100%", textAlign: "center", marginTop: "20px", color: "#000000"}}>使用说明 | Instructions</h2>
        
        <font size="2" style={{width: "100%", textAlign: "center", marginTop: "20px", color: "#000000"}}>
            <li style={{marginLeft:"10px"}}>1. <b>创建生命</b>。点击“生命甲”、“生命乙”、“世界”选择例子，或点击“自定”创建自己的世界；</li>
            <li style={{marginLeft:"10px"}}>2. 若你选择“自定”，请在方格世界中点击方格，以创建或消除生命。黑色代表存活，白色代表死亡；</li>
            <li style={{marginLeft:"10px"}}>3. <b>开始生存</b>。点击“开始”使世界开始运作，点击“暂停”使世界暂停运作，点击“清空”清空世界中的生命；</li>
            <li style={{marginLeft:"10px"}}>4. 在重复第一步前，请先“暂停”或“清空”，使某些静止的生命体暂停生存。</li>
        </font>
        <br></br>
        <font size="2" style={{width: "100%", textAlign: "center", marginTop: "20px", color: "#000000"}}>
            <li style={{marginLeft:"10px"}}>1. <b>Create Lives</b>. Click on "Life A", "Life B", or "The World" to select an example, or click on "Custom" to create your lives;</li>
            <li style={{marginLeft:"10px"}}>2. If you select "Custom", click on a square in the World to create or eliminate a Life. Black for Life, white for Death;</li>
            <li style={{marginLeft:"10px"}}>3. <b>Start Surviving</b>. Click on "Start" to start the World, click on "Stop" to stop the world, click on "Clear" to clear all Lives;</li>
            <li style={{marginLeft:"10px"}}>4. Before repeating the first step, please first click on "Stop" or "Clear", so that some static life suspends survivals.</li>
        </font>
      
        <h2 style={{width: "100%", textAlign: "center", marginTop: "20px", color: "#000000"}}>解释 | Explanations</h2>
        <font size="2" style={{width: "100%", textAlign: "center", marginTop: "20px", color: "#000000"}}>
          <center>
          每一个方块代表一个生命，并有以下规则：
          <li style={{marginLeft:"10px"}}>1. 每个生命有两种状态-<b>存活</b>或<b>死亡</b>，每个生命只与其周围<b>八个生命</b>产生互动；</li>
          <li style={{marginLeft:"10px"}}>2. 若某个生命状态为<b>存活</b>，并且其周围有 <b>0 或 1</b> 个存活的生命，此生命便会<b>死亡</b>（模拟濒危）；</li>
          <li style={{marginLeft:"10px"}}>3. 若某个生命状态为<b>存活</b>，并且其周围有<b>超过 3</b> 个存活的生命，此生命便会<b>死亡</b>（模拟数量过多）；</li>
          <li style={{marginLeft:"10px"}}>4. 若某个生命状态为<b>存活</b>，并且其周围有 <b>2 或 3</b> 个存活的生命，此生命<b>保持原状</b>（模拟平衡）；</li>
          <li style={{marginLeft:"10px"}}>5. 若某个生命状态为<b>死亡</b>，并且其周围有 <b>3</b> 个存活的生命，此生命<b>变成存活状态</b>（模拟繁殖）；</li>
          <li style={{marginLeft:"10px"}}>6. 当前的所有生命会<b>同时</b>被以上规则处理，以得到下一代生命，不断更新。</li>
          </center>

          <br></br>

          <center>
          Each square represents a Life with following rules:
          <li style={{marginLeft:"10px"}}>1. Each Life has two states - <b>alive</b> or <b>dead</b>, and each Life interacts only with the <b>eight</b> lives around it;</li>
          <li style={{marginLeft:"10px"}}>2. If a Life state is <b>alive</b>, and there is <b>0 or 1</b> living Life around it, this Life will <b>die</b> (for underpopulation);</li>
          <li style={{marginLeft:"10px"}}>3. If a Life state is <b>alive</b>, and there are <b>more than 3</b> living Lives around it, this Life will <b>die</b> (for overpopulation)</li>
          <li style={{marginLeft:"10px"}}>4. If a Life state is <b>alive</b>, and there are <b>2 or 3</b> living Lives around it, this Life will <b>survive</b> (for balance); </li>
          <li style={{marginLeft:"10px"}}>5. If a Life state is <b>dead</b>, and there are exactly <b>3</b> living Lives around it, this Life will be <b>alive</b> (for reproduction); </li>
          <li style={{marginLeft:"10px"}}>6. All current Lives will be processed by the above rules <b>simultaneously</b> to get the next generation repeatedly.</li>
          </center>
        </font>

        </Col>
      </Row>
    </Container>
);
// ===== End of Frontend Layout =====

// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05