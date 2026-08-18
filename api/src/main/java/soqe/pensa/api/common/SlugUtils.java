package soqe.pensa.api.common;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

    private SlugUtils() {
        // Prevent instantiation
    }

    public static String toSlug(String input) {
        if (input == null) return null;
        String nonWhitespace = Pattern.compile("[^\\w-]").matcher(input.toLowerCase().replace(" ", "-")).replaceAll("");
        String normalized = Normalizer.normalize(nonWhitespace, Normalizer.Form.NFD);
        return Pattern.compile("[\\p{InCombiningDiacriticalMarks}]").matcher(normalized).replaceAll("");
    }
}
