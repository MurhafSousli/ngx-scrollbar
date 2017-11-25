import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header.component';
import { RouterLinkStubDirective, RouterLinkActiveStubDirective } from './../../../testing/router-stubs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let linkDes: DebugElement[];
  let links: RouterLinkStubDirective[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbCollapseModule.forRoot()
      ],
      declarations: [
        HeaderComponent,
        RouterLinkStubDirective,
        RouterLinkActiveStubDirective
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
      });
  }));

  beforeEach(() => {
    // trigger initial data binding
    fixture.detectChanges();

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

    // get the attached link directive instances using the DebugElement injectors
    links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can get RouterLinks from template', () => {
    expect(links.length).toBe(2, 'should have 2 links');
    expect(links[0].linkParams).toBe('/home', '1st link should go to Home');
    expect(links[1].linkParams).toBe('/getting-started', '2nd link should go to GettingStarted');
  });

  it('can click Home link in template', () => {
    const homeLinkDe = linkDes[0];
    const homeLink = links[0];

    expect(homeLink.navigatedTo).toBeNull('link should not have navigated yet');

    homeLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(homeLink.navigatedTo).toBe('/home');
  });

  it('can click GettingStarted link in template', () => {
    const gettingStartedLinkDe = linkDes[1];
    const gettingStartedLink = links[1];

    expect(gettingStartedLink.navigatedTo).toBeNull('link should not have navigated yet');

    gettingStartedLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(gettingStartedLink.navigatedTo).toBe('/getting-started');
  });
});
