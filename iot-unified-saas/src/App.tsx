import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import type { NavKey } from './components/layout/AppShell';
import { ScenarioCenter } from './components/modules/ScenarioCenter';
import { SceneStudio } from './components/modules/SceneStudio';
import { isPlaceholderNav, PlatformModulePlaceholder } from './components/modules/PlatformModulePlaceholder';
import { scenePackages, getScene } from './scenes/registry';
import type { CardInstance } from './platform/types';
import type { StrategySectionModule } from './platform/types';

function cloneCards(cards: CardInstance[]): CardInstance[] {
  return cards.map(c => ({ ...c }));
}

export default function App() {
  const [nav, setNav] = useState<NavKey>('scenes');
  const [sceneKey, setSceneKey] = useState(() => scenePackages[0]?.key ?? 'greenhouse');

  const scene = useMemo(() => getScene(sceneKey) ?? scenePackages[0], [sceneKey]);

  const [draftCards, setDraftCards] = useState(
    () => cloneCards(scenePackages[0]?.defaultPage.cards ?? []) as CardInstance[],
  );

  useEffect(() => {
    const s = getScene(sceneKey);
    if (s?.defaultPage.cards?.length) {
      setDraftCards(cloneCards(s.defaultPage.cards));
    } else {
      setDraftCards([]);
    }
  }, [sceneKey]);

  const reorderCardsInBucket = useCallback(
    (layoutGroup: string, rootNest: 'medium' | 'solution' | undefined, orderedIds: string[]) => {
      const nestKey = rootNest ?? '';
      setDraftCards(prev => {
        const idToOrder = new Map(orderedIds.map((id, i) => [id, i]));
        return prev.map(c => {
          if (c.layoutGroup !== layoutGroup || (c.rootNest ?? '') !== nestKey) return c;
          const o = idToOrder.get(c.id);
          if (o === undefined) return c;
          return { ...c, order: o };
        });
      });
    },
    [],
  );

  const toggleCard = useCallback((id: string) => {
    setDraftCards(prev => prev.map(c => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  }, []);

  const policies = scene.strategyPages;

  const [policyId, setPolicyId] = useState(() => scenePackages[0]?.strategyPages[0]?.id ?? '');
  const [draftSections, setDraftSections] = useState((): StrategySectionModule[] => {
    const p0 = scenePackages[0]?.strategyPages[0];
    return p0 ? [...p0.sections] : [];
  });

  useEffect(() => {
    const s = getScene(sceneKey);
    const p0 = s?.strategyPages[0];
    setPolicyId(p0?.id ?? '');
    setDraftSections(p0 ? [...p0.sections] : []);
  }, [sceneKey]);

  const selectPolicy = useCallback(
    (id: string) => {
      setPolicyId(id);
      const s = getScene(sceneKey);
      const p = s?.strategyPages.find(x => x.id === id);
      if (p) setDraftSections([...p.sections]);
    },
    [sceneKey],
  );

  const toggleSection = useCallback(
    (kind: StrategySectionModule['kind']) => {
      const p = policies.find(x => x.id === policyId);
      if (!p) return;
      setDraftSections(prev => {
        const exists = prev.some(s => s.kind === kind);
        if (exists) return prev.filter(s => s.kind !== kind);
        const def = p.sections.find(s => s.kind === kind);
        if (!def) return prev;
        return [...prev, def];
      });
    },
    [policies, policyId],
  );

  const reorderDraftSections = useCallback((next: StrategySectionModule[]) => {
    setDraftSections(next);
  }, []);

  const openSceneInStudio = useCallback((key: string) => {
    setSceneKey(key);
    setNav('studio');
  }, []);

  return (
    <AppShell active={nav} onNavigate={setNav}>
      {nav === 'scenes' && (
        <ScenarioCenter scenes={scenePackages} selectedKey={sceneKey} onSelect={openSceneInStudio} />
      )}
      {nav === 'studio' && (
        <SceneStudio
          scene={scene}
          draftCards={draftCards}
          onReorderCardsInBucket={reorderCardsInBucket}
          onToggleCard={toggleCard}
          policies={policies}
          selectedPolicyId={policyId}
          onSelectPolicy={selectPolicy}
          draftSections={draftSections}
          onToggleSection={toggleSection}
          onReorderDraftSections={reorderDraftSections}
        />
      )}
      {isPlaceholderNav(nav) && <PlatformModulePlaceholder nav={nav} />}
    </AppShell>
  );
}
