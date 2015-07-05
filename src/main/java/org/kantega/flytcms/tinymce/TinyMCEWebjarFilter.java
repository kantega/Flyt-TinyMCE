package org.kantega.flytcms.tinymce;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class TinyMCEWebjarFilter extends OncePerRequestFilter implements Filter {

    private final String PATH_PREFIX = "/flytcms/tinymce/";
    private String tinymceVersion;

    public TinyMCEWebjarFilter() throws ServletException {
        super();
        try {
            tinymceVersion = readVersion();
        } catch (IOException e) {
            throw new ServletException("Could not read Tiny MCE version");
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        // /webjars/tinymce/tinymce.min.js -> /webjars/tinymce/${version}/tinymce.min.js
        // /aksess/tinymce/tinymce.min.js -> /webjars/tinymce/${version}/tinymce.min.js
        String requestURI = request.getRequestURI();

        String substring = requestURI.substring(requestURI.indexOf(PATH_PREFIX) + PATH_PREFIX.length());

        String tinyPath = "/webjars/tinymce/" + tinymceVersion + "/" + substring;

        ServletContext sc = request.getServletContext();
        InputStream is = sc.getResourceAsStream(tinyPath);
        if(is == null) {
            is = sc.getResourceAsStream("/flytcms/tinymce/" + substring);
        }

        if(is != null){
            httpServletResponse.setHeader("Content-Type", "application/javascript");
            writeToStream(is, httpServletResponse.getOutputStream());
        }

    }

    private void writeToStream(InputStream is, ServletOutputStream outputStream) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(is));
             OutputStream os = outputStream) {
            int c = 0;
            while ((c = reader.read()) != -1) {
                os.write(c);
            }
        }
    }

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
