// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05
import org.junit.Test;

public class CellWorldTest {

    @Test
    // Blinker
    public void BlinkerTest() {
        CellWorld newWorld = new CellWorld(3,3);
        Cell c1 = new Cell(0,1);
        newWorld.add(c1);
        Cell c2 = new Cell(1,1);
        newWorld.add(c2);
        Cell c3 = new Cell(2,1);
        newWorld.add(c3);
        while (true) {
            try{
                System.out.println(newWorld.listAll());
                System.out.println("");
                newWorld.refresh();
                Thread.sleep(1000);
            }
            catch (Exception e) {}
        }
    }

    @Test
    public void BlockTest() {
        CellWorld newWorld = new CellWorld(4,4);
        Cell c1 = new Cell(1,1);
        Cell c2 = new Cell(1,2);
        Cell c3 = new Cell(2,1);
        Cell c4 = new Cell(2,2);
        newWorld.add(c1);
        newWorld.add(c2);
        newWorld.add(c3);
        newWorld.add(c4);
        while (true) {
            try{
                System.out.println(newWorld.listAll());
                System.out.println("");
                newWorld.refresh();
                Thread.sleep(1000);
            }
            catch (Exception e) {}
        }
    }

    @Test
    public void TubTest() {
        CellWorld newWorld = new CellWorld(5,5);
        Cell c1 = new Cell(2,1);
        Cell c2 = new Cell(1,2);
        Cell c3 = new Cell(3,2);
        Cell c4 = new Cell(2,3);
        newWorld.add(c1);
        newWorld.add(c2);
        newWorld.add(c3);
        newWorld.add(c4);
        while (true) {
            try{
                System.out.println(newWorld.listAll());
                System.out.println("");
                newWorld.refresh();
                Thread.sleep(1000);
            }
            catch (Exception e) {}
        }
    }

    @Test
    public void GliderTest() {
        CellWorld newWorld = new CellWorld(15,15);
        Cell c1 = new Cell(2,0);
        Cell c2 = new Cell(0,1);
        Cell c3 = new Cell(2,1);
        Cell c4 = new Cell(1,2);
        Cell c5 = new Cell(2,2);
        newWorld.add(c1);
        newWorld.add(c2);
        newWorld.add(c3);
        newWorld.add(c4);
        newWorld.add(c5);
        while (true) {
            try{
                System.out.println(newWorld.listAll());
                System.out.println("");
                newWorld.refresh();
                Thread.sleep(500);
            }
            catch (Exception e) {}
        }
    }
}
// Made by Mike_Zhang(mike.ultrafish.cn)
// UltraFish.cn
// 2022-08-05