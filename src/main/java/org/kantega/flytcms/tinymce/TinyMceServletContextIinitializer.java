package org.kantega.flytcms.tinymce;

import javax.servlet.DispatcherType;
import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.util.EnumSet;
import java.util.Set;

public class TinyMceServletContextIinitializer implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
        EnumSet<DispatcherType> dispatcherTypes = EnumSet.allOf(DispatcherType.class);
        dispatcherTypes.remove(DispatcherType.INCLUDE);
        ctx.addFilter("tinymcewebjarfilter", TinyMCEWebjarFilter.class)
                .addMappingForUrlPatterns(dispatcherTypes, false, "/flytcms/tinymce/*", "/aksess/tinymce/*");
    }
}
