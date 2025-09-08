declare module "*.module.css" {
    const classes: Record<string, string>;
    export default classes;
}

declare module '*.svg' {
    import * as React from 'react';
    const Component: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;
    export default Component;
}
