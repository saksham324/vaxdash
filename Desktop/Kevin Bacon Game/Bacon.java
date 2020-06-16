/*
* CS 10, Dartmouth, Winter 2020
* Problem Set 4 Submission
* @author Saksham Arora
* @author Gokul Srinivasan
* Single Shared Code
*
* The Kevin Bacon Game
*/

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

public class Bacon {
    private static BufferedReader input1, input2, input3;               // instance variables referring to all the input files
    private Map<String, String> id2actor;                               // mapping actor id to actor name
    private Map<String, String> id2movie;                               // mapping movie id to movie name
    private Map<String, Set<String>> movie2actor;                       // mapping movie name to actor name
    private static Graph<String, Set<String>> baconGraph;               // Graph of all actors as vertices and movies as edge labels
    private static Graph<String, Set<String>> bfstree;                  // Shortest path tree graph from a particular center of the universe
    private static String key;
    //  adding string file names to the constructor as parameters so we can make test cases
    private String file1;                                               // pathnames for files taken as input from the user
    private String file2;
    private String file3;
    // taking input from the console using the Scanner
    private Scanner in = new Scanner(System.in);
    private String line;
    private String name;

    public Bacon(String file1, String file2, String file3){
        id2actor = new HashMap<String, String>();
        id2movie = new HashMap<String, String>();
        movie2actor = new HashMap<String, Set<String>>();
        baconGraph = new AdjacencyMapGraph<String, Set<String>>();
        bfstree = new AdjacencyMapGraph<String, Set<String>>();
        // instantiate the file paths
        this.file1 = file1;
        this.file2 = file2;
        this.file3 = file3;
    }

    // method to createMap of movie name to actor name by reading in from inout files
    public void createMap(){
        try{
            input1 = new BufferedReader(new FileReader(file1));
            input2 = new BufferedReader(new FileReader(file2));
            input3 = new BufferedReader(new FileReader(file3));
        }
        catch (FileNotFoundException e){

            System.out.println("\n File not found: " + e.getMessage());
            return;
        }

        try{
            String line1, line2, line3;

            while ((line1 = input1.readLine())!= null){
                String[] pieces1 = line1.split("\\|");

                //System.out.println(pieces);
                if (!id2actor.containsKey(pieces1[0])) {
                    id2actor.put(pieces1[0], pieces1[1]);
                }
            }
            //System.out.println(id2actor);

            while ((line2 = input2.readLine())!= null){
                String[] pieces2 = line2.split("\\|");

                //System.out.println(pieces);
                if(!id2movie.containsKey(pieces2[0])){
                    id2movie.put(pieces2[0], pieces2[1]);
                }
            }

            while ((line3 = input3.readLine())!= null){
                String[] pieces3 = line3.split("\\|");

                if(!movie2actor.containsKey(id2movie.get(pieces3[0]))){
                    movie2actor.put(id2movie.get(pieces3[0]), new HashSet<String>());
                }
                movie2actor.get(id2movie.get(pieces3[0])).add(id2actor.get(pieces3[1]));
            }
            //System.out.println(movie2actor.keySet());


        }
        catch (IOException e){
            System.out.println("Error while reading" + e.getMessage());
        }
    }

    // method to create baconGraph
    public void createGraph(){
        for(String s: id2actor.keySet()){
            baconGraph.insertVertex(id2actor.get(s));
        }

        for (String movie: movie2actor.keySet()) {
            Set<String> edgeval = new HashSet<String>();
            ArrayList<String> actors = new ArrayList<>();
            edgeval.add(movie);
            //System.out.println(edgeval);
            actors.addAll(movie2actor.get(movie));

            for (int i = 0; i < actors.size(); i++) {
                for (int j = i + 1; j < actors.size(); j++) {
                    baconGraph.insertUndirected(actors.get(i), actors.get(j), edgeval);
                }
            }
        }

        //System.out.println(baconGraph);

    }
    // handles input if U is selected
    public void inputU() throws Exception{
        name = in.nextLine();
        //check if the name is valid, like the graph contains it
        if(!baconGraph.hasVertex(name)){
            throw new Exception("Invalid Input: please enter a valid node");
        }
        System.out.println(name + " game : ");
        bfstree = GraphLibrary.bfs(baconGraph, name);
        line = in.nextLine();
        handleInput(line);
    }
    //handles the input if p is selected
    public void inputP() throws Exception{
        String actor = in.nextLine();
        //makes sure the input is correct
        if(!baconGraph.hasVertex(actor)){
            throw new Exception("Invalid Entry: Please input a valid node");
        }
        List<String> path = GraphLibrary.getPath(bfstree, actor);
        System.out.println(GraphLibrary.getPath(bfstree, actor));
        System.out.println(actor + " number is " + (path.size() - 1));
        for (int i = 1; i < path.size(); i++) {
            System.out.println(path.get(i - 1) + " appeared in " + bfstree.getLabel(path.get(i), path.get(i - 1)) + " with " + path.get(i));
        }
    }
    public void inputI(){
        System.out.println(GraphLibrary.missingVertices(baconGraph, bfstree));
    }

    public void inputC() throws Exception{

        //get user input for the number they want
        System.out.println("Enter number: ");
        String high = in.nextLine();

        //make sure user input is valid
        int h;
        try {
            h = Integer.parseInt(high);
        }
        catch (Exception e){
            throw e;
        }

        Set<String> averageSet = new HashSet<>();
        ArrayList<Double> averages = new ArrayList<>();
        Map<String, Double> byseparation = new HashMap<>();

        for (String v : bfstree.vertices()) {
            Graph<String, Set<String>> tree = GraphLibrary.bfs(baconGraph, v);
            Double sep = GraphLibrary.averageSeparation(tree, v);
            byseparation.put(v, sep);
            averages.add(sep);
        }
        // sorting the list of numbers into ascending order
        averages.sort(new Comparator<Double>() {
            @Override
            public int compare(Double u, Double v) {
                if (u < v){return -1;}
                else if (u > v){return 1;}
                else{return 0;}
            }
        });

        for(double i: averages) {
            for (String key : byseparation.keySet()) {
                if (byseparation.get(key) == i && !averageSet.contains(key)) {
                    averageSet.add(key);
                    if (i >= 0 && i <= h) {
                        String str = key + " " + byseparation.get(key);
                        System.out.println(str);
                    }
                }
            }
        }

    }
    //need degree from low to high
    public void inputD() throws Exception{

        System.out.println("Enter low high: ");
        String val = in.nextLine();
        String[] v = val.split(" ");
        int low;
        int high;
        try {
            low = Integer.parseInt(v[0]);
            high = Integer.parseInt(v[1]);
        }
        catch (Exception e){
            throw new Exception(e + ". Please enter a valid numerical input of the format: <low> <high>");
        }
        // vertex, degree
        Map<String, Integer> bydegree = new HashMap<>();

        for (String t : bfstree.vertices()) {
            bydegree.put(t, baconGraph.inDegree(t));
        }
        for(int i = low; i <= high; i++) {
            for (String key : bydegree.keySet()) {
                if (bydegree.get(key) == i) {
                    System.out.println(key + ": " + i);

                }
            }
        }
    }
    // handles input if S is pressed
    public void inputS(){

        Set<String> pathsizeSet = new HashSet<>();
        ArrayList<Integer> pathsize = new ArrayList<>();
        Map<String, Integer> bypathsize = new HashMap<>();

        for (String v : bfstree.vertices()) {
            bypathsize.put(v, GraphLibrary.getPath(bfstree, v).size() - 1);
            pathsize.add(GraphLibrary.getPath(bfstree, v).size() - 1);
        }

        pathsize.sort(new Comparator<Integer>() {
            @Override
            public int compare(Integer u, Integer v) {
                if (u < v) return -1;
                else if (u > v) return 1;
                else return 0;
            }
        });

        System.out.println("Enter low high: ");
        String val = in.nextLine();
        String[] v = val.split(" ");
        int low = Integer.parseInt(v[0]);
        int high = Integer.parseInt(v[1]);

        for(int i: pathsize) {
            for (String key : bypathsize.keySet()) {
                if (bypathsize.get(key) == i && !pathsizeSet.contains(key)) {
                    pathsizeSet.add(key);
                    // print out anybody that is between these distances from the center node
                    if (i >= low && i <= high) {
                        System.out.println(key);
                    }
                }
            }
        }
    }
    // generic handleInout method with try..catch to call appropriate function
    public void handleInput(String character){
        this.line = character;

        if (line.equals("u")) {
            try {
                inputU();
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        if (line.equals("p")) {
            try {
                inputP();
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        else if (line.equals("i")) {
            // no way to mess up I
            inputI();
        }
        else if (line.equals("c")) {
            try {
                inputC();
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        else if (line.equals("d")) {
            try {
                inputD();
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        else if (line.equals("s")) {
            try {
                inputS();
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
    }
    // Main Driver for the project. Can adjust the file names.
    public static void main(String[] args) throws Exception {

        System.out.println("Commands:" + '\n' + "c <#>: list top (positive number) or bottom (negative) <#> centers of the universe, sorted by average separation" + '\n'
                + "d <low> <high>: list actors sorted by degree, with degree between low and high " + '\n' + "i: list actors with infinite separation from the current center" + '\n' +
                "p <name>: find path from <name> to current center of the universe" + '\n' + "s <low> <high>: list actors sorted by non-infinite separation from the current center, with separation between low and high" + '\n' +
                "u <name>: make <name> the center of the universe");

        //can adjust file names, enter the full path though
        String file1 = "inputs/actorsTest.txt";
        String file2 = "inputs/moviesTest.txt";
        String file3 =  "inputs/movie-actorsTest.txt";

        Bacon bmap = new Bacon(file1, file2, file3);
        bmap.createMap();
        bmap.createGraph();

        Scanner in = new Scanner(System.in);
        System.out.print("> ");
        String line = in.nextLine();
        String name = "Kevin Bacon";
        bfstree = GraphLibrary.bfs(baconGraph, name);
        bmap.handleInput(line);
    }
}
