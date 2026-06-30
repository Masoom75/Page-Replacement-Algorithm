import java.util.*;

public class FOPageReplacement {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Input
        System.out.print("Enter number of pages: ");
        int n = sc.nextInt();
        int[] pages = new int[n];

        System.out.print("Enter the page reference string: ");
        for (int i = 0; i < n; i++) {
            pages[i] = sc.nextInt();
        }

        System.out.print("Enter number of frames: ");
        int framesCount = sc.nextInt();

        // FIFO Logic
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> set = new HashSet<>();
        int hit = 0, fault = 0;

        // Output table header
        System.out.printf("\n%-10s%-30s%-10s\n", "Step", "Frames", "Status");
        System.out.println("-----------------------------------------------------");

        for (int i = 0; i < n; i++) {
            int page = pages[i];
            String status;

            if (set.contains(page)) {
                hit++;
                status = "Hit";
            } else {
                fault++;
                status = "Fault";
                if (queue.size() == framesCount) {
                    int removed = queue.poll();
                    set.remove(removed);
                }
                queue.add(page);
                set.add(page);
            }

            // Display current frame content
            List<Integer> currentFrames = new ArrayList<>(queue);
            System.out.printf("%-10d%-30s%-10s\n", (i + 1), currentFrames, status);
        }

        // Percentages
        double hitPercent = (double) hit / n * 100;
        double faultPercent = (double) fault / n * 100;

        // Summary
        System.out.println("\nSummary:");
        System.out.println("Total Hits: " + hit);
        System.out.println("Total Faults: " + fault);
        System.out.printf("Hit Percentage: %.2f%%\n", hitPercent);
        System.out.printf("Fault Percentage: %.2f%%\n", faultPercent);

        sc.close();
    }
}