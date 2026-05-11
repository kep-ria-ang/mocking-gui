import { useMemo } from 'react';

import { Input } from '@components/ui/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import {
  HandlerResponseVariant,
  HandlerType,
  StoredHandlerVariants,
} from '@mocking-gui-types/handler';
import { useHandlerStore } from '@store/useHandlerStore';
import { getVariantKey } from '@utils/common/keys';

import { APIItemProps } from './index';

type APIItemControlProps = {
  handlerKey: string;
  handlerConfig: StoredHandlerVariants;
} & APIItemProps;

type VariantGroupProps = {
  label: string;
  type: HandlerType;
  variants?: HandlerResponseVariant[];
};
/**
 * APIVariantsControl Component
 *
 * A unified dropdown control for selecting the handler mode (Auto, Manual, Swagger)
 * and specific response variants.
 */
export const APIVariantsControl = (props: APIItemControlProps) => {
  const { apiGroup, handlerKey, handlerConfig } = props;
  const updateHandlerConfigs = useHandlerStore(state => state.updateHandlerConfigs);

  const formatVariantStatus = (status?: number) => {
    return isNaN(Number(status)) || !status ? 'Default' : status;
  };

  const VariantGroup = ({ label, type, variants }: VariantGroupProps) => {
    if (!variants || variants.length === 0) return null;
    return (
      <SelectGroup>
        <SelectLabel className="text-[10px] text-slate-400 font-normal">{label}</SelectLabel>
        {variants.map(variant => (
          <SelectItem
            key={getVariantKey(variant)}
            value={`${type}:${variant.name}`}
            className="text-xs"
          >
            <div className="flex items-center min-w-0 w-full gap-2 font-normal">
              <span className="font-semibold shrink-0">{formatVariantStatus(variant.status)}</span>
              <span
                className="text-muted-foreground truncate"
                title={variant.name.replace(/\n+/g, ' ')}
              >
                {variant.name.replace(/\n+/g, ' ')}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const handleValueChange = (value: string) => {
    if (value === HandlerType.AUTO) {
      updateHandlerConfigs(handlerKey, { type: HandlerType.AUTO, variant: undefined });
      return;
    }

    const colonIndex = value.indexOf(':');
    if (colonIndex === -1) return;

    const type = value.substring(0, colonIndex) as HandlerType;
    const variant = value.substring(colonIndex + 1);

    switch (type) {
      case HandlerType.MANUAL:
        updateHandlerConfigs(handlerKey, { type: HandlerType.MANUAL, variant });
        break;
      case HandlerType.SWAGGER:
        updateHandlerConfigs(handlerKey, { type: HandlerType.SWAGGER, variant });
        break;
    }
  };

  const currentValue = useMemo(() => {
    if (handlerConfig.type === HandlerType.AUTO) {
      return HandlerType.AUTO;
    }
    if (handlerConfig.variant) {
      return `${handlerConfig.type}:${handlerConfig.variant}`;
    }
    return undefined;
  }, [handlerConfig]);

  const selectedDisplayValue = useMemo(() => {
    if (handlerConfig.type === HandlerType.AUTO) {
      return 'Auto Mode';
    }
    if (handlerConfig.variant) {
      const allVariants = [
        ...(apiGroup?.responseVariants || []),
        ...(apiGroup?.swaggerResponseVariants || []),
      ];
      const match = allVariants.find(({ name }) => name === handlerConfig.variant);
      if (match) {
        return (
          <>
            <span className="font-semibold shrink-0">{formatVariantStatus(match.status)}</span>
            <span className="truncate">{match.name.replace(/\n+/g, ' ')}</span>
          </>
        );
      }
      return handlerConfig.variant;
    }
    return undefined;
  }, [handlerConfig, apiGroup]);

  const hasAuto = !!apiGroup?.responseVariantsFn;

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger className="h-7 text-xs bg-slate-50 w-[140px] px-2 text-left shrink-0">
        <SelectValue placeholder="Select Mode">{selectedDisplayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-w-[400px]">
        {hasAuto && (
          <SelectGroup>
            <SelectLabel className="text-[10px] text-slate-400 font-normal">Auto</SelectLabel>
            <SelectItem value={HandlerType.AUTO} className="text-xs">
              Auto Mode
            </SelectItem>
          </SelectGroup>
        )}
        <VariantGroup
          label="Manual"
          type={HandlerType.MANUAL}
          variants={apiGroup.responseVariants}
        />
        <VariantGroup
          label="Swagger"
          type={HandlerType.SWAGGER}
          variants={apiGroup.swaggerResponseVariants}
        />
      </SelectContent>
    </Select>
  );
};

/**
 * APIDelayControl Component
 *
 * Input control for setting a simulated network delay for the handler.
 */
export const APIDelayControl = (props: APIItemControlProps) => {
  const { handlerKey, handlerConfig } = props;
  const updateHandlerConfigs = useHandlerStore(state => state.updateHandlerConfigs);

  const handleChangeDelay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    updateHandlerConfigs(handlerKey, { delay: value });
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      <Input
        type="text"
        className="h-7 w-[60px] text-xs px-2 text-right bg-slate-50"
        placeholder="0"
        value={handlerConfig.delay || ''}
        onChange={handleChangeDelay}
      />
      <span className="text-[10px] text-slate-400 w-[14px]">ms</span>
    </div>
  );
};
