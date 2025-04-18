package carevn.luv2code.MovieNest.configuration;

import io.github.cdimascio.dotenv.Dotenv;

public class ConfigLoader {
    private static final Dotenv dotenv = Dotenv.load();

    public static String getEnv(String key) {
        return dotenv.get(key);
    }
}
