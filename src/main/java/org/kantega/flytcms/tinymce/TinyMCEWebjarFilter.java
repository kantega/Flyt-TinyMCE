package org.kantega.flytcms.tinymce;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.URL;

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
            httpServletResponse.setHeader("Content-Type", sc.getMimeType(substring));
            writeToStream(is, httpServletResponse.getOutputStream());
        } else {
            httpServletResponse.sendError(HttpServletResponse.SC_NOT_FOUND);
        }

    }

    private void writeToStream(InputStream is, ServletOutputStream outputStream) throws IOException {
        try (InputStream in = is;
             OutputStream os = outputStream) {
            int n = 0;
            byte[] buffer = new byte[1024];
            while (-1 != (n = in.read(buffer))) {
                os.write(buffer, 0, n);
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
