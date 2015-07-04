package org.kantega.flytcms.tinymce;

import javax.servlet.*;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class TinyMCEWebjarFilter implements Filter {

    private String tinymceVersion;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        try {
            tinymceVersion = readVersion();
        } catch (IOException e) {
            throw new ServletException("Could not read Tiny MCE version");
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // /webjars/tinymce/tinymce.min.js -> /webjars/tinymce/${version}/tinymce.min.js
    }

    @Override
    public void destroy() {}

    private String readVersion() throws IOException {
        URL resource = getClass().getResource("tinymce.version");
        try(InputStream inputStream = resource.openStream()){
            StringBuilder textBuilder = new StringBuilder();
            try (Reader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                int c = 0;
                while ((c = reader.read()) != -1) {
                    textBuilder.append((char) c);
                }
            }
            return textBuilder.toString();
        }
    }
}
