/*
* CS 10, Dartmouth, Winter 2020
* Problem Set 4 Submission
* @author Saksham Arora
* @author Gokul Srinivasan
* Single Shared Code
*
* Graph Library Implementation
 */


import java.util.*;

public class GraphLibrary<V,E> {
    public Map<V, V> backTrack; //keep track of prior vertex when vertex is discovered -> Map<current vertex, prior vertex>

    public static <V, E> Graph<V, E> bfs(Graph<V, E> g, V source) {
        Graph<V, E> pathTree = new AdjacencyMapGraph<>();
        Queue<V> queue = new LinkedList<V>();
        //initialize backTrack
        if(source != null && g.hasVertex(source)){
            queue.add(source);
            pathTree.insertVertex(source);
        }

        while (!queue.isEmpty()) {              //loop until no more vertices
            V u = queue.remove();               //dequeue
            for (V v : g.inNeighbors(u)) {     //loop over out neighbors
                if (!pathTree.hasVertex(v)) {     //if neighbor not visited, then neighbor is discovered from this vertex
                    pathTree.insertVertex(v);             //add neighbor to visited Set
                    queue.add(v);               //enqueue neighbor
                    pathTree.insertDirected(u, v, g.getLabel(v, u));
                }
            }
        }
        return pathTree;
    }

    public static <V,E> List<V> getPath(Graph<V,E> tree, V v) {
        if (!tree.hasVertex(v)) {
            System.out.println("\tNo path found");
            return new ArrayList<V>();
        }
        //start from end vertex and work backward to start vertex
        ArrayList<V> path = new ArrayList<V>(); //this will hold the path from start to end vertex
        V end = v;

        path.add(0, end);
        Stack<V> stack = new Stack<V>(); //stack to implement DFS

        stack.push(end); //push start vertex
        while (!stack.isEmpty()) { //loop until no more vertices
            V x = stack.pop(); //get most recent vertex
            for (V u : tree.inNeighbors(x)) { //loop over in neighbors
                stack.push(u); //push non-visted neighbor onto stack
                path.add(u); //save that this vertex was discovered from prior vertex
            }
        }
        return path;
    }

    public static <V,E> Set<V> missingVertices(Graph<V,E> graph, Graph<V,E> subgraph){
        Set<V> missing = new HashSet<>();
        for(V v : graph.vertices()){
            if(!subgraph.hasVertex(v)) missing.add(v);
        }
        return missing;
    }

    public static <V,E> double averageSeparation(Graph<V,E> tree, V root){
        return averageHelper(tree, root, 0) / tree.numVertices();
    }

    public static <V, E> double averageHelper (Graph<V,E> tree, V root, double depth) {
        double sum = depth;

        if (root == null) {
            return 0;
        }

        Iterator<V> iter = tree.outNeighbors(root).iterator();
        while(iter.hasNext()){
            V u = iter.next();
            sum += averageHelper(tree, u,  depth + 1);

        }
        return sum;
    }
}


