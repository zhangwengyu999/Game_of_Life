// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
public class Cell {
    private int x; // x coordinate
    private int y; // y coordinate
    private Cell[] neighbors = new Cell[8]; // {left_top,top,right_top,left,right,left_bottom,bottom,right_bottom}
    private boolean isNowLive; // current live status
    private boolean willBeLive; // next live status

    public Cell(int inX, int inY) {
        x = inX;
        y = inY;
        for (int i = 0;i<8;i++) {
            neighbors[i] = this;
        }
    }

    public int getX() {
        return x;
    }
    public int getY() {
        return y;
    }

    public boolean isLive() {
        return isNowLive;
    }

    public boolean equal(Cell other) {
        return ((this.getX() == other.getX()) && (this.getY() == other.getY()));
    }

    public void setLeft(Cell inCell) {
        neighbors[3] = inCell;
    }
    public void setRight(Cell inCell) {
        neighbors[4] = inCell;
    }
    public void setTop(Cell inCell) {
        neighbors[1] = inCell;
    }
    public void setBottom(Cell inCell) {
        neighbors[6] = inCell;
    }
    public void setLeftTop(Cell inCell) {
        neighbors[0] = inCell;
    }
    public void setRightTop(Cell inCell) {
        neighbors[2] = inCell;
    }
    public void setLeftBottom(Cell inCell) {
        neighbors[5] = inCell;
    }
    public void setRightBottom(Cell inCell) {
        neighbors[7] = inCell;
    }

    public void setBorn() {
        willBeLive = true;
    }
    public void setDie() {
        willBeLive = false;
    }

    // get the number of live neighbors
    public int getCountLiveNeighbors() {
        int count = 0;
        for (Cell c : neighbors) {
            if (c!=null && c.isNowLive && !c.equal(this)) {count++;}
        }
        return count;
    }

    // calculate the next live status
    public void setNextLife() {
        int numLiveNeighbors = getCountLiveNeighbors();
        if (numLiveNeighbors<2 || numLiveNeighbors>3) {
            setDie();
        }
        else if (numLiveNeighbors == 3) {
            setBorn();
        }
    }

    // refresh the next live status
    public void refreshNextLive() {
        isNowLive = willBeLive;
    }
}
// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
