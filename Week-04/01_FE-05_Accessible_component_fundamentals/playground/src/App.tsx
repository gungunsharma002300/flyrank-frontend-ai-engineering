import { useState } from "react";
import { Modal } from "./components/scratch/Modal";
import { Tabs } from "./components/scratch/Tabs";
import { Disclosure } from "./components/scratch/Disclosure";
import { StateBadge } from "./components/StateBadge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./components/shadcn/dialog";
import { Tabs as ShadcnTabs, TabsList, TabsTrigger, TabsContent } from "./components/shadcn/tabs";

export default function App() {
  const [scratchModalOpen, setScratchModalOpen] = useState(false);
  const [scratchTab, setScratchTab] = useState("profile");
  const [scratchDisclosureOpen, setScratchDisclosureOpen] = useState(false);
  const [shadcnDialogOpen, setShadcnDialogOpen] = useState(false);
  const [shadcnTab, setShadcnTab] = useState("profile");

  return (
    <main className="app">
      <header className="app-header">
        <p className="app-eyebrow">FE-05 · accessible component fundamentals</p>
        <h1>
          The ARIA tree, <span className="app-title-accent">made visible</span>
        </h1>
        <p className="app-lede">
          Every badge below is a real <code>aria-*</code> attribute read live off the DOM —
          not a mockup. Tab through with your keyboard to watch the state change.
        </p>
      </header>

      <div className="comparison-grid">
        <section className="lane lane-scratch">
          <div className="lane-header">
            <span className="lane-tag">01</span>
            <div>
              <p className="lane-eyebrow">// built by hand</p>
              <h2>From scratch</h2>
            </div>
          </div>

          <div className="component-block">
            <div className="component-block-head">
              <h3>Modal</h3>
              <StateBadge attr="aria-modal" value={scratchModalOpen} />
            </div>
            <button type="button" className="btn btn-scratch" onClick={() => setScratchModalOpen(true)}>
              Open modal
            </button>
            <Modal
              open={scratchModalOpen}
              onClose={() => setScratchModalOpen(false)}
              titleId="scratch-modal-title"
              title="Scratch-built modal"
            >
              <p>Escape closes me. Tab is trapped inside. Focus returns to the trigger on close.</p>
            </Modal>
          </div>

          <div className="component-block">
            <div className="component-block-head">
              <h3>Tabs</h3>
              <StateBadge attr="aria-selected" value={scratchTab} />
            </div>
            <Tabs
              onActiveChange={setScratchTab}
              items={[
                { id: "profile", label: "Profile", content: <p>Profile panel content.</p> },
                { id: "settings", label: "Settings", content: <p>Settings panel content.</p> },
                { id: "billing", label: "Billing", content: <p>Billing panel content.</p> },
              ]}
            />
          </div>

          <div className="component-block">
            <div className="component-block-head">
              <h3>Disclosure</h3>
              <StateBadge attr="aria-expanded" value={scratchDisclosureOpen} />
            </div>
            <Disclosure summary="What is ARIA?" onOpenChange={setScratchDisclosureOpen}>
              <p>
                ARIA (Accessible Rich Internet Applications) is a set of attributes that make web
                content and applications more accessible to people using assistive technologies.
              </p>
            </Disclosure>
          </div>
        </section>

        <section className="lane lane-shadcn">
          <div className="lane-header">
            <span className="lane-tag">02</span>
            <div>
              <p className="lane-eyebrow">// shadcn/ui + radix</p>
              <h2>Library-assisted</h2>
            </div>
          </div>

          <div className="component-block">
            <div className="component-block-head">
              <h3>Dialog</h3>
              <StateBadge attr="aria-modal" value={shadcnDialogOpen} />
            </div>
            <Dialog open={shadcnDialogOpen} onOpenChange={setShadcnDialogOpen}>
              <DialogTrigger asChild>
                <button type="button" className="btn btn-shadcn">
                  Open dialog
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>shadcn dialog</DialogTitle>
                <DialogDescription>
                  Built on Radix UI. Focus trap, portal rendering, and scroll lock are handled for
                  you.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>

          <div className="component-block">
            <div className="component-block-head">
              <h3>Tabs</h3>
              <StateBadge attr="aria-selected" value={shadcnTab} />
            </div>
            <ShadcnTabs defaultValue="profile" onValueChange={setShadcnTab}>
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">Profile panel content.</TabsContent>
              <TabsContent value="settings">Settings panel content.</TabsContent>
              <TabsContent value="billing">Billing panel content.</TabsContent>
            </ShadcnTabs>
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <p>
          Keyboard map: <kbd>Tab</kbd> move · <kbd>Esc</kbd> close · <kbd>←</kbd>
          <kbd>→</kbd> switch tab · <kbd>Enter</kbd>/<kbd>Space</kbd> activate
        </p>
      </footer>
    </main>
  );
}
