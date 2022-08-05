// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
public class CellWorld {
    private int width; // width of the world
    private int height; // height of the world
    private int heightBound; // height of the world bound
    private int widthBound; // width of the world bound

    private Cell[][] cells; // [h][w], for storing the cells

    public CellWorld(int inH, int inW) {
        height = inH;
        width = inW;
        heightBound = height+2;
        widthBound = width+2;
        cells = new Cell[heightBound][widthBound];
        for (int i=0;i<heightBound;i++) {
            for (int j=0;j<widthBound;j++) {
                cells[i][j] = new Cell(j,i);
            }
        }
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                connectToNeighbors(cells[i][j]);
            }
        }

    }

    // connect the neighbors of the cell
    private void connectToNeighbors(Cell inCell) {
        inCell.setLeft(cells[inCell.getY()][inCell.getX()-1]);
        inCell.setRight(cells[inCell.getY()][inCell.getX()+1]);

        inCell.setTop(cells[inCell.getY()-1][inCell.getX()]);
        inCell.setBottom(cells[inCell.getY()+1][inCell.getX()]);

        inCell.setLeftTop(cells[inCell.getY() - 1][inCell.getX() - 1]);
        inCell.setRightTop(cells[inCell.getY() - 1][inCell.getX() + 1]);

        inCell.setLeftBottom(cells[inCell.getY() + 1][inCell.getX() - 1]);
        inCell.setRightBottom(cells[inCell.getY() + 1][inCell.getX() + 1]);
    }

    // get the cell at the given index
    public Cell getCell(int i) {
        int inX = (int)Math.floor(i/height);
        int inY = i%height;
        return cells[inY][inX];
    }

    // add the cell to the world
    public void add(Cell inCell) {
        cells[inCell.getY()+1][inCell.getX()+1].setBorn();
        cells[inCell.getY()+1][inCell.getX()+1].refreshNextLive();
    }

    // reverse the cell's live status
    public void reverse(Cell inCell) {
        if (inCell.isLive()) {
            inCell.setDie();
        } else {
            inCell.setBorn();
        }
        inCell.refreshNextLive();
    }

    // refresh the next live status of the cells
    public void refresh() {
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                cells[i][j].setNextLife();
            }
        }
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                cells[i][j].refreshNextLive();
            }
        }
    }

    // "kill" all the cells
    public void resetWorld() {
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                cells[i][j].setDie();
                cells[i][j].refreshNextLive();
            }
        }
    }

    // get the number of live cells
    public int getLiveNum() {
        int count = 0;
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                if (cells[i][j].isLive()) {
                    count++;
                }
            }
        }
        return count;
    }

    // list the live cells in String
    public String listAll() {
        StringBuilder sb = new StringBuilder();
        for (int i=1;i<height+1;i++) {
            for (int j=1;j<width+1;j++) {
                if (cells[i][j].isLive()) {
                    sb.append("O  ");
                }
                else {
                    sb.append("·  ");
                }
            }
            sb.append("\n");
        }
        return sb.toString();
    }
}
// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
