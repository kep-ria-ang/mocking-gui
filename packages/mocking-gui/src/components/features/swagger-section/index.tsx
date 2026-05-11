import SwaggerConfigSection from './swagger-config';
import SwaggerConnectionSection from './swagger-connection';

const SwaggerSection = () => {
  return (
    <div className="flex flex-col gap-6 pt-1">
      <SwaggerConfigSection />
      <SwaggerConnectionSection />
    </div>
  );
};

export default SwaggerSection;
